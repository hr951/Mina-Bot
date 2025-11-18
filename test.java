
// EndStoneBlaster — Fabric 1.21.8 // Full project files for VSCode + Gradle (production-ready template)

// ----------------------------------------------------------------------------- // build.gradle (Groovy) // ----------------------------------------------------------------------------- plugins { id 'fabric-loom' version '1.2-SNAPSHOT' id 'maven-publish' }

group = 'com.example' version = '0.1.0' archivesBaseName = 'endstoneblaster'

repositories { mavenCentral() maven { url = 'https://maven.fabricmc.net/' } }

def minecraft_version = '1.21.8'

dependencies { minecraft "com.mojang:minecraft:${minecraft_version}" mappings "net.fabricmc:yarn:${minecraft_version}+build.1:v2" modImplementation "net.fabricmc:fabric-api:0.90.0+1.21.8" }

java { toolchain { languageVersion = JavaLanguageVersion.of(17) } }

loom { runConfigs { client { name = 'client' } } }

// ----------------------------------------------------------------------------- // settings.gradle // ----------------------------------------------------------------------------- rootProject.name = 'EndStoneBlaster'

// ----------------------------------------------------------------------------- // gradle.properties (minimal) // ----------------------------------------------------------------------------- org.gradle.jvmargs=-Xmx4G

// ----------------------------------------------------------------------------- // src/main/resources/fabric.mod.json // ----------------------------------------------------------------------------- { "schemaVersion": 1, "id": "endstoneblaster", "version": "0.1.0", "name": "EndStoneBlaster", "description": "Client-only mod to fast-break end_stone in a cubic area (private servers only).", "authors": ["あなた"], "license": "MIT", "environment": "client", "entrypoints": { "client": [ "com.example.endstoneblaster.EndStoneBlasterClient" ] }, "depends": { "fabricloader": ">=0.14.0", "fabric": "*" } }

// ----------------------------------------------------------------------------- // src/main/resources/endstoneblaster_config.json // ----------------------------------------------------------------------------- { "targets": ["minecraft:end_stone"], "rangeHalf": 10, "perTickLimit": 5000, "keybind": "G" }

// ----------------------------------------------------------------------------- // src/main/java/com/example/endstoneblaster/EndStoneBlasterClient.java // ----------------------------------------------------------------------------- package com.example.endstoneblaster;

import net.fabricmc.api.ClientModInitializer; import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents; import net.fabricmc.fabric.api.client.keybinding.v1.KeyBindingHelper; import net.minecraft.client.MinecraftClient; import net.minecraft.client.option.KeyBinding; import net.minecraft.client.util.InputUtil; import net.minecraft.util.Identifier; import net.minecraft.util.math.BlockPos; import net.minecraft.block.Blocks; import org.lwjgl.glfw.GLFW;

import java.io.InputStream; import java.nio.charset.StandardCharsets; import java.util.Queue; import java.util.concurrent.ArrayBlockingQueue;

public class EndStoneBlasterClient implements ClientModInitializer { private static KeyBinding openGuiKey; private static final Queue<BlockPos> queue = new ArrayBlockingQueue<>(200000); private static volatile boolean enabled = false; private static int rangeHalf = 10; private static int perTickLimit = 5000;

@Override
public void onInitializeClient() {
    // load config if present
    try (InputStream is = EndStoneBlasterClient.class.getClassLoader().getResourceAsStream("endstoneblaster_config.json")) {
        if (is != null) {
            String s = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            Config.loadFromJson(s);
            rangeHalf = Config.getRangeHalf();
            perTickLimit = Config.getPerTickLimit();
        }
    } catch (Exception e) {
        // ignore, defaults remain
    }

    openGuiKey = KeyBindingHelper.registerKeyBinding(new KeyBinding(
        "key.endstoneblaster.opengui",
        InputUtil.Type.KEYSYM,
        GLFW.GLFW_KEY_G,
        "category.endstoneblaster"
    ));

    ClientTickEvents.END_CLIENT_TICK.register(client -> {
        while (openGuiKey.wasPressed()) {
            client.setScreen(new EndStoneBlasterScreen());
        }

        if (enabled) {
            tickProcess(client);
        }
    });
}

private void tickProcess(MinecraftClient client) {
    if (client.player == null || client.world == null) return;

    if (queue.isEmpty()) {
        BlockPos hit = RaycastHelper.getLookingBlockPos(client);
        if (hit == null) return;
        if (!client.world.getBlockState(hit).isOf(Blocks.END_STONE)) return;

        BreakWorker.buildQueue(client, queue, hit, rangeHalf);
    }

    int sent = 0;
    while (sent < perTickLimit && !queue.isEmpty()) {
        BlockPos pos = queue.poll();
        if (pos == null) break;
        BreakWorker.sendInstantBreakPacket(pos);
        // optimistic client-side visual update
        try {
            client.world.setBlockState(pos, Blocks.AIR.getDefaultState(), 3);
        } catch (Exception ignored) {}
        sent++;
    }
}

// Called from GUI
public static void setEnabled(boolean e) { enabled = e; }
public static boolean isEnabled() { return enabled; }
public static int getRangeHalf() { return rangeHalf; }
public static void setRangeHalf(int v) { rangeHalf = v; }
public static int getPerTickLimit() { return perTickLimit; }
public static void setPerTickLimit(int v) { perTickLimit = v; }

}

// ----------------------------------------------------------------------------- // src/main/java/com/example/endstoneblaster/BreakWorker.java // ----------------------------------------------------------------------------- package com.example.endstoneblaster;

import net.minecraft.client.MinecraftClient; import net.minecraft.util.math.BlockPos; import net.minecraft.util.math.Direction; import net.minecraft.network.packet.c2s.play.PlayerActionC2SPacket; import net.minecraft.block.Blocks;

import java.util.Queue;

public class BreakWorker { public static void buildQueue(MinecraftClient client, Queue<BlockPos> queue, BlockPos center, int r) { int py = client.player.getBlockY(); int minY = Math.max(py - r, client.world.getBottomY()); int maxY = Math.min(py + r, client.world.getTopY());

for (int x = -r; x <= r; x++) {
        for (int y = minY - center.getY(); y <= maxY - center.getY(); y++) {
            for (int z = -r; z <= r; z++) {
                BlockPos p = center.add(x, y, z);
                try {
                    if (client.world.getBlockState(p).isOf(Blocks.END_STONE)) {
                        queue.add(p);
                    }
                } catch (Exception ignored) {}
            }
        }
    }
}

public static void sendInstantBreakPacket(BlockPos pos) {
    MinecraftClient client = MinecraftClient.getInstance();
    if (client == null || client.getNetworkHandler() == null) return;
    client.execute(() -> {
        client.getNetworkHandler().sendPacket(new PlayerActionC2SPacket(
            PlayerActionC2SPacket.Action.STOP_DESTROY_BLOCK,
            pos,
            Direction.UP
        ));
    });
}

}

// ----------------------------------------------------------------------------- // src/main/java/com/example/endstoneblaster/RaycastHelper.java // ----------------------------------------------------------------------------- package com.example.endstoneblaster;

import net.minecraft.client.MinecraftClient; import net.minecraft.util.hit.BlockHitResult; import net.minecraft.util.hit.HitResult; import net.minecraft.util.math.BlockPos;

public class RaycastHelper { public static BlockPos getLookingBlockPos(MinecraftClient client) { HitResult hr = client.crosshairTarget; if (hr == null || hr.getType() != HitResult.Type.BLOCK) return null; BlockHitResult bhr = (BlockHitResult) hr; return bhr.getBlockPos(); } }

// ----------------------------------------------------------------------------- // src/main/java/com/example/endstoneblaster/Config.java // ----------------------------------------------------------------------------- package com.example.endstoneblaster;

import com.google.gson.Gson; import com.google.gson.JsonObject;

public class Config { private static int rangeHalf = 10; private static int perTickLimit = 5000;

public static void loadFromJson(String json) {
    try {
        Gson g = new Gson();
        JsonObject obj = g.fromJson(json, JsonObject.class);
        if (obj.has("rangeHalf")) rangeHalf = obj.get("rangeHalf").getAsInt();
        if (obj.has("perTickLimit")) perTickLimit = obj.get("perTickLimit").getAsInt();
    } catch (Exception ignored) {}
}

public static int getRangeHalf() { return rangeHalf; }
public static int getPerTickLimit() { return perTickLimit; }

}

// ----------------------------------------------------------------------------- // src/main/java/com/example/endstoneblaster/EndStoneBlasterScreen.java // ----------------------------------------------------------------------------- package com.example.endstoneblaster;

import net.minecraft.client.MinecraftClient; import net.minecraft.client.gui.screen.Screen; import net.minecraft.client.gui.widget.ButtonWidget; import net.minecraft.client.gui.widget.ButtonWidget.PressAction; import net.minecraft.text.Text;

public class EndStoneBlasterScreen extends Screen { protected EndStoneBlasterScreen() { super(Text.literal("EndStoneBlaster")); }

@Override
protected void init() {
    int w = this.width;
    int h = this.height;
    final MinecraftClient client = MinecraftClient.getInstance();

    ButtonWidget toggle = new ButtonWidget(w/2 - 100, h/2 - 30, 200, 20,
        Text.literal(EndStoneBlasterClient.isEnabled() ? "Disable" : "Enable"),
        button -> {
            EndStoneBlasterClient.setEnabled(!EndStoneBlasterClient.isEnabled());
            button.setMessage(Text.literal(EndStoneBlasterClient.isEnabled() ? "Disable" : "Enable"));
        }
    );
    addDrawableChild(toggle);

    ButtonWidget close = new ButtonWidget(w/2 - 100, h/2, 200, 20, Text.literal("Close"), button -> this.onClose());
    addDrawableChild(close);

    // simple range/perTick controls could be added here in future
}

@Override
public boolean shouldPause() { return false; }

}

// ----------------------------------------------------------------------------- // README (short) // ----------------------------------------------------------------------------- /README.md

EndStoneBlaster (Fabric 1.21.8)

Usage:

1. Place produced jar into your client's mods/ folder.


2. Make sure Fabric Loader and Fabric API for 1.21.8 are installed in the client.


3. Join a private server where all players consent. Backup world before testing.


4. In-game: aim at an end_stone block and press G -> toggle Enabled. The mod will queue and rapidly send instant-break packets for end_stone in a cubic area (rangeHalf configurable in resources file).



Build:

Windows (recommended): run `.

Use gradlew build in project root. Build artifact will be in build/libs/.


// ----------------------------------------------------------------------------- // End of project files // -----------------------------------------------------------------------------
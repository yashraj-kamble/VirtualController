// ==UserScript==
// @name         Virtual Gamepad
// @namespace    https://github.com/yashraj-kamble/VirtualController
// @version      1.0.0
// @description  Virtual gamepad with trackpad
// @license      MIT
// @author       Yashraj
// @match        https://play.geforcenow.com/*
// @match        https://www.xbox.com/*/play*
// @match        https://hardwaretester.com/gamepad*
// @icon         https://icons.iconarchive.com/icons/paomedia/small-n-flat/72/gamepad-icon.png
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
(function () {
    'use strict';
    // =========================================================================
    // CONFIG
    // =========================================================================
    const CONFIG = {
        opacity: 0.2,
        stickRadius: 45,
        zIndexUI: "2147483647",
        zIndexPad: "2147483646",
        doubleTapMs: 300,
        borderWidth: "2px",
        borderColor: "rgba(255,255,255,0.8)",
        trackpad: {
            sensitivityX: 16,
            sensitivityY: 11.0,
            curve: 1.05,
            deadzone: 0.03,
            minimumOutputMagnitude: 0.12,
            innerRadius: 36,
            outerRadius: 150,
            outerZoneStrength: 1.0,
            velocityRampStart: 4,
            velocityRampEnd: 45,
            velocityRampMax: 0.6,
            maxDeltaPerFrame: 0.09,
            smoothingSlow: 0.02,
            smoothingFast: 0.22,
            smoothingRampStart: 4,
            smoothingRampEnd: 45,
            holdFrames: 0,
            radialActivitySpeedThreshold: 2,
            returnToZeroDelayMs: {
                inner: 30,
                mid: 45,
                outer: Infinity
            },
            idleDecayRate: 0.72,
            coastOnRelease: false,
            coastFrictionPerSecond: 2.5,
            sensitivityMultiplier: 1.0
        },
        gyro: {
            enabled: true,
            activationButton: "LT",
            yawAxis: "alpha",
            pitchAxis: "beta",
            rollAxis: "gamma",
            minSensitivity: 15,
            maxSensitivity: 30,
            minThresholdDegPerSec: 5,
            maxThresholdDegPerSec: 75,
            pitchSensitivityScale: 0.9,
            axisScale: 1200,
            cutoffSpeedDegPerSec: 1,
            cutoffRecoveryDegPerSec: 5,
            smoothThresholdDegPerSec: 5,
            smoothTimeSeconds: 0.125,
            invertYaw: true,
            invertPitch: false,
            worldSpace: false,
            sensitivityMultiplier: 1.0
        },
        vibration: {
            tapEnabled: true,
            tapMs: 12,
            stickClickMs: 20,
            editModeMs: 30,
            rumbleEnabled: true,
            rumbleMaxMs: 300,
            rumbleOverlapMs: 60
        },
        toggleButton: {
            top: "10%", right: "0vw",
            size: "8vh",
            opacity: 0.7,
            colorOn: "#00A86B", colorOff: "#FF4D4D"
        }
    };
    const PRESET_LAYOUTS = [
        // ---- PRESET 1 ----
        {
            dpad: {
                color: "#FFF", size: "26vh", armThickness: "34%", cornerRadius: 6, fontSize: "3vh",
                x: "26%", y: "17.5%"
            },
            sticks: {
                left: { size: "12vw", x: "12.4%", y: "32.9%" },
                right: { size: "14vw", x: "75.8%", y: "19.9%", enabled: false }
            },
            buttons: {
                Y: { color: "#FFF", width: "12vh", height: "12vh", x: "92.7%", y: "49.1%", borderRadius: "50%" },
                X: { color: "#FFF", width: "12vh", height: "12vh", x: "88.4%", y: "38.5%", borderRadius: "50%" },
                B: { color: "#FFF", width: "12vh", height: "12vh", x: "97.1%", y: "38.5%", borderRadius: "50%" },
                A: { color: "#FFF", width: "12vh", height: "12vh", x: "92.7%", y: "28.8%", borderRadius: "50%" },
                LB: { color: "#FFF", width: "17vh", height: "17vh", x: "4.0%", y: "67.0%", borderRadius: "50%" },
                LT: { color: "#FFF", width: "17vh", height: "17vh", x: "12%", y: "60.0%", borderRadius: "50%" },
                RT: { color: "#FFF", width: "17vh", height: "17vh", x: "88%", y: "62.0%", borderRadius: "50%" },
                RB: { color: "#FFF", width: "17vh", height: "17vh", x: "96%", y: "67.0%", borderRadius: "50%" },
                SELECT: { color: "#FFF", width: "7vw", height: "7vh", x: "5%", y: "8%", borderRadius: "20%", glyph: "▶" },
                START: { color: "#FFF", width: "7vw", height: "7vh", x: "5%", y: "16%", borderRadius: "20%", glyph: "☰" },
                L3: { color: "#FFF", width: "8vh", height: "8vh", x: "18%", y: "15.3%", borderRadius: "50%" },
                R3: { color: "#FFF", width: "8vh", height: "8vh", x: "84.1%", y: "8.6%", borderRadius: "50%" }
            }
        },
        // ---- PRESET 2 ----
        {
            dpad: {
                color: "#FFF", size: "26vh", armThickness: "34%", cornerRadius: 6, fontSize: "3vh",
                x: "26%", y: "17.5%"
            },
            sticks: {
                left: { size: "12vw", x: "12.4%", y: "32.9%" },
                right: { size: "14vw", x: "75.8%", y: "19.9%", enabled: false }
            },
            buttons: {
                Y: { color: "#FFF", width: "12vh", height: "12vh", x: "92.7%", y: "49.1%", borderRadius: "50%" },
                X: { color: "#FFF", width: "12vh", height: "12vh", x: "88.4%", y: "38.5%", borderRadius: "50%" },
                B: { color: "#FFF", width: "12vh", height: "12vh", x: "97.1%", y: "38.5%", borderRadius: "50%" },
                A: { color: "#FFF", width: "12vh", height: "12vh", x: "92.7%", y: "28.8%", borderRadius: "50%" },
                LB: { color: "#FFF", width: "17vh", height: "17vh", x: "4.0%", y: "67.0%", borderRadius: "50%" },
                LT: { color: "#FFF", width: "17vh", height: "17vh", x: "12%", y: "60.0%", borderRadius: "50%" },
                RT: { color: "#FFF", width: "17vh", height: "17vh", x: "88%", y: "62.0%", borderRadius: "50%" },
                RB: { color: "#FFF", width: "17vh", height: "17vh", x: "96%", y: "67.0%", borderRadius: "50%" },
                SELECT: { color: "#FFF", width: "7vw", height: "7vh", x: "5%", y: "8%", borderRadius: "20%", glyph: "▶" },
                START: { color: "#FFF", width: "7vw", height: "7vh", x: "5%", y: "16%", borderRadius: "20%", glyph: "☰" },
                L3: { color: "#FFF", width: "8vh", height: "8vh", x: "18%", y: "15.3%", borderRadius: "50%" },
                R3: { color: "#FFF", width: "8vh", height: "8vh", x: "84.1%", y: "8.6%", borderRadius: "50%" }
            }
        },
        // ---- PRESET 3 ----
        {
            dpad: {
                color: "#FFF", size: "26vh", armThickness: "34%", cornerRadius: 6, fontSize: "3vh",
                x: "26%", y: "17.5%"
            },
            sticks: {
                left: { size: "12vw", x: "12.4%", y: "32.9%" },
                right: { size: "14vw", x: "75.8%", y: "19.9%", enabled: false }
            },
            buttons: {
                Y: { color: "#FFF", width: "12vh", height: "12vh", x: "92.7%", y: "49.1%", borderRadius: "50%" },
                X: { color: "#FFF", width: "12vh", height: "12vh", x: "88.4%", y: "38.5%", borderRadius: "50%" },
                B: { color: "#FFF", width: "12vh", height: "12vh", x: "97.1%", y: "38.5%", borderRadius: "50%" },
                A: { color: "#FFF", width: "12vh", height: "12vh", x: "92.7%", y: "28.8%", borderRadius: "50%" },
                LB: { color: "#FFF", width: "17vh", height: "17vh", x: "4.0%", y: "67.0%", borderRadius: "50%" },
                LT: { color: "#FFF", width: "17vh", height: "17vh", x: "12%", y: "60.0%", borderRadius: "50%" },
                RT: { color: "#FFF", width: "17vh", height: "17vh", x: "88%", y: "62.0%", borderRadius: "50%" },
                RB: { color: "#FFF", width: "17vh", height: "17vh", x: "96%", y: "67.0%", borderRadius: "50%" },
                SELECT: { color: "#FFF", width: "7vw", height: "7vh", x: "5%", y: "8%", borderRadius: "20%", glyph: "▶" },
                START: { color: "#FFF", width: "7vw", height: "7vh", x: "5%", y: "16%", borderRadius: "20%", glyph: "☰" },
                L3: { color: "#FFF", width: "8vh", height: "8vh", x: "18%", y: "15.3%", borderRadius: "50%" },
                R3: { color: "#FFF", width: "8vh", height: "8vh", x: "84.1%", y: "8.6%", borderRadius: "50%" }
            }
        }
    ];
    // =========================================================================
    // CONSTANTS
    // =========================================================================
    const BUTTON_INDEX = {
        A: 0, B: 1, X: 2, Y: 3,
        LB: 4, RB: 5, LT: 6, RT: 7,
        SELECT: 8, START: 9, L3: 10, R3: 11,
        "↑": 12, "↓": 13, "←": 14, "→": 15
    };
    const Z_UI = CONFIG.zIndexUI;
    const Z_PAD = CONFIG.zIndexPad;
    const STICK_RADIUS = CONFIG.stickRadius;
    const DEFAULT_OPACITY = CONFIG.opacity;
    const FILL_BG = `rgba(68, 68, 68, ${DEFAULT_OPACITY})`;
    // =========================================================================
    // HELPERS
    // =========================================================================
    const realGamepads = navigator.getGamepads.bind(navigator);
    const clamp = (num, min, max) => Math.max(min, Math.min(num, max));
    // =========================================================================
    // STATE
    // =========================================================================
    let controllerEnable = false;
    let toggleButton = null;
    let sensitivityPanel = null;
    let editMode = false;
    const PRESET_COUNT = 3;
    let presetOverrides = [{}, {}, {}];
    try {
        const loaded = JSON.parse(GM_getValue('gyropad_presets', '[{},{},{}]'));
        if (Array.isArray(loaded) && loaded.length === PRESET_COUNT) presetOverrides = loaded;
    } catch (e) { /* keep defaults */ }
    let currentPresetIndex = 0;
    try {
        const savedIndex = parseInt(GM_getValue('gyropad_preset_index', '0'), 10);
        if (savedIndex >= 0 && savedIndex < PRESET_COUNT) currentPresetIndex = savedIndex;
    } catch (e) { /* keep 0 */ }
    let layoutOverrides = presetOverrides[currentPresetIndex];
    try {
        const savedSens = JSON.parse(GM_getValue('gyropad_sensitivity', '{}'));
        if (typeof savedSens.trackpad === 'number') CONFIG.trackpad.sensitivityMultiplier = savedSens.trackpad;
        if (typeof savedSens.gyro === 'number') CONFIG.gyro.sensitivityMultiplier = savedSens.gyro;
    } catch (e) { /* use defaults */ }
    function mergeElementConfig(baseCfg, overridePos) {
        if (!overridePos) return { ...baseCfg };
        const merged = { ...baseCfg };
        if (overridePos.x) merged.x = overridePos.x;
        if (overridePos.y) merged.y = overridePos.y;
        if (overridePos.width) merged.width = overridePos.width;
        if (overridePos.height) merged.height = overridePos.height;
        return merged;
    }
    function resolvePresetLayout(index) {
        const base = PRESET_LAYOUTS[index];
        const overrides = presetOverrides[index] || {};
        const buttons = {};
        for (const [key, cfg] of Object.entries(base.buttons)) {
            buttons[key] = mergeElementConfig(cfg, overrides[key]);
        }
        const leftStick = mergeElementConfig(
            { x: base.sticks.left.x, y: base.sticks.left.y, size: base.sticks.left.size },
            overrides.LEFT_STICK ? { x: overrides.LEFT_STICK.x, y: overrides.LEFT_STICK.y, width: overrides.LEFT_STICK.width } : null
        );
        if (overrides.LEFT_STICK && overrides.LEFT_STICK.width) leftStick.size = overrides.LEFT_STICK.width;
        const rightStickBase = { x: base.sticks.right.x, y: base.sticks.right.y, size: base.sticks.right.size, enabled: base.sticks.right.enabled };
        const rightStick = { ...rightStickBase };
        if (overrides.RIGHT_STICK) {
            if (overrides.RIGHT_STICK.x) rightStick.x = overrides.RIGHT_STICK.x;
            if (overrides.RIGHT_STICK.y) rightStick.y = overrides.RIGHT_STICK.y;
            if (overrides.RIGHT_STICK.width) rightStick.size = overrides.RIGHT_STICK.width;
            if (typeof overrides.RIGHT_STICK.enabled === 'boolean') rightStick.enabled = overrides.RIGHT_STICK.enabled;
        }
        const dpad = mergeElementConfig(
            { x: base.dpad.x, y: base.dpad.y, size: base.dpad.size, color: base.dpad.color, armThickness: base.dpad.armThickness, cornerRadius: base.dpad.cornerRadius, fontSize: base.dpad.fontSize },
            overrides.DPAD ? { x: overrides.DPAD.x, y: overrides.DPAD.y, width: overrides.DPAD.width } : null
        );
        if (overrides.DPAD && overrides.DPAD.width) dpad.size = overrides.DPAD.width;
        return { buttons, sticks: { left: leftStick, right: rightStick }, dpad };
    }
    function persistLayout() {
        GM_setValue('gyropad_presets', JSON.stringify(presetOverrides));
    }
    function persistPresetIndex() {
        GM_setValue('gyropad_preset_index', String(currentPresetIndex));
    }
    function persistSensitivity() {
        GM_setValue('gyropad_sensitivity', JSON.stringify({
            trackpad: CONFIG.trackpad.sensitivityMultiplier,
            gyro: CONFIG.gyro.sensitivityMultiplier
        }));
    }
    function hapticTap(ms) {
        if (CONFIG.vibration.tapEnabled && navigator.vibrate) {
            navigator.vibrate(ms || CONFIG.vibration.tapMs);
        }
    }
    let trackpadActive = false;
    let trackpadTouchId = null;
    let trackpadCooldown = 0;
    let trackpadLastMoveTime = 0;
    let trackpadZone = 'inner';
    let trackpadCoasting = false;
    let trackpadCoastLastFrameTime = 0;
    let gyroRaw = { alpha: 0, beta: 0, gamma: 0 };
    let gyroGravity = { x: 0, y: 0, z: 9.8 };
    let gyroSupported = false;
    let gyroSmoothedX = 0;
    let gyroSmoothedY = 0;
    let gyroLastSampleTime = 0;
    let simulatedStick = { x1: 0.0, y1: 0.0, x2: 0.0, y2: 0.0 };
    const HARD_MAX_VIBRATE_MS = 5000;
    function sanitizeDuration(ms, fallback) {
        return (Number.isFinite(ms) && ms >= 0) ? ms : fallback;
    }
    const virtualVibrationActuator = {
        type: "dual-rumble",
        playEffect: function (type, params) {
            params = params || {};
            const requestedDuration = sanitizeDuration(params.duration, 200);
            const configuredCap = sanitizeDuration(CONFIG.vibration.rumbleMaxMs, HARD_MAX_VIBRATE_MS);
            const cap = Math.min(configuredCap, HARD_MAX_VIBRATE_MS);
            const duration = Math.min(requestedDuration, cap);
            if (CONFIG.vibration.rumbleEnabled && navigator.vibrate) {
                const strength = Math.max(params.weakMagnitude || 0, params.strongMagnitude || 0);
                if (strength > 0.05) {
                    const overlap = sanitizeDuration(CONFIG.vibration.rumbleOverlapMs, 60);
                    const motorDuration = Math.round(duration * strength) + overlap;
                    navigator.vibrate(motorDuration);
                }
            }
            return new Promise((resolve) => setTimeout(() => resolve("complete"), duration));
        },
        reset: function () {
            if (navigator.vibrate) navigator.vibrate(0);
            return Promise.resolve("complete");
        }
    };
    let simulatedGamepad = {
        id: "Xbox 360 Controller (XInput STANDARD GAMEPAD)",
        index: 0,
        connected: true,
        mapping: "standard",
        buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })),
        axes: [0, 0, 0, 0, 0, 0],
        timestamp: 0.0,
        vibrationActuator: null,
        hand: "",
        hapticActuators: [],
        pose: null
    };
    // =========================================================================
    // GYRO AIM
    // =========================================================================
    function setupGyro() {
        if (!CONFIG.gyro.enabled || typeof DeviceMotionEvent === 'undefined') return;
        const attach = () => {
            window.addEventListener('devicemotion', (event) => {
                const rr = event.rotationRate;
                if (rr && rr.alpha !== null && rr.alpha !== undefined) {
                    gyroSupported = true;
                    gyroRaw.alpha = rr.alpha;
                    gyroRaw.beta = rr.beta;
                    gyroRaw.gamma = rr.gamma;
                }
                const g = event.accelerationIncludingGravity;
                if (g && g.x !== null && g.x !== undefined) {
                    gyroGravity.x = g.x;
                    gyroGravity.y = g.y;
                    gyroGravity.z = g.z;
                }
            }, true);
        };
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            document.addEventListener('touchend', function requestOnce() {
                document.removeEventListener('touchend', requestOnce);
                DeviceMotionEvent.requestPermission().then((state) => {
                    if (state === 'granted') attach();
                }).catch(() => {});
            }, { once: true });
        } else {
            attach();
        }
    }
    function gyroSensitivityCurve(speed) {
        const { minSensitivity, maxSensitivity, minThresholdDegPerSec, maxThresholdDegPerSec } = CONFIG.gyro;
        if (speed <= minThresholdDegPerSec) return minSensitivity;
        if (speed >= maxThresholdDegPerSec || maxThresholdDegPerSec <= minThresholdDegPerSec) return maxSensitivity;
        const t = (speed - minThresholdDegPerSec) / (maxThresholdDegPerSec - minThresholdDegPerSec);
        return minSensitivity + (maxSensitivity - minSensitivity) * t;
    }
    function gyroCutoffFactor(speed) {
        const { cutoffSpeedDegPerSec, cutoffRecoveryDegPerSec } = CONFIG.gyro;
        if (speed <= cutoffSpeedDegPerSec) return 0;
        if (speed >= cutoffRecoveryDegPerSec || cutoffRecoveryDegPerSec <= cutoffSpeedDegPerSec) return 1;
        return (speed - cutoffSpeedDegPerSec) / (cutoffRecoveryDegPerSec - cutoffSpeedDegPerSec);
    }
    function applyGyroSmoothing(targetX, targetY, speed, dt) {
        const { smoothThresholdDegPerSec, smoothTimeSeconds } = CONFIG.gyro;
        if (smoothThresholdDegPerSec <= 0 || smoothTimeSeconds <= 0 || speed >= smoothThresholdDegPerSec) {
            gyroSmoothedX = targetX;
            gyroSmoothedY = targetY;
            return { x: targetX, y: targetY };
        }
        const half = smoothThresholdDegPerSec / 2;
        const fade = speed <= half ? 1 : clamp(1 - (speed - half) / half, 0, 1);
        const timeConstantAlpha = 1 - Math.exp(-dt / smoothTimeSeconds);
        const effectiveAlpha = 1 - fade * (1 - timeConstantAlpha);
        gyroSmoothedX += (targetX - gyroSmoothedX) * effectiveAlpha;
        gyroSmoothedY += (targetY - gyroSmoothedY) * effectiveAlpha;
        return { x: gyroSmoothedX, y: gyroSmoothedY };
    }
    function computeWorldSpaceYaw(rawYaw, rawRoll, gravity) {
        const mag = Math.hypot(gravity.x, gravity.y, gravity.z) || 9.8;
        const tilt = clamp(Math.abs(gravity.z) / mag, 0, 1);
        return rawYaw * (1 - tilt) + rawRoll * tilt;
    }
    function isGyroActive() {
        if (!CONFIG.gyro.enabled) return false;
        const idx = BUTTON_INDEX[CONFIG.gyro.activationButton];
        return simulatedGamepad.buttons[idx]?.pressed === true;
    }
    function getGyroContribution() {
        if (!isGyroActive()) {
            gyroSmoothedX = 0;
            gyroSmoothedY = 0;
            gyroLastSampleTime = 0;
            return { x: 0, y: 0 };
        }
        const now = performance.now();
        const dt = gyroLastSampleTime > 0 ? Math.min(0.1, (now - gyroLastSampleTime) / 1000) : 1 / 60;
        gyroLastSampleTime = now;
        const {
            yawAxis, pitchAxis, rollAxis, worldSpace,
            pitchSensitivityScale, axisScale, invertYaw, invertPitch
        } = CONFIG.gyro;
        const angle = (screen.orientation && screen.orientation.angle) || 0;
        const landscapeSign = (angle === 90) ? 1 : -1;
        const readAxis = (axisName) => {
            const raw = gyroRaw[axisName] || 0;
            return axisName === 'alpha' ? raw : raw * landscapeSign;
        };
        let rawYaw = readAxis(yawAxis);
        const rawPitch = readAxis(pitchAxis);
        if (worldSpace) {
            const rawRoll = readAxis(rollAxis);
            rawYaw = computeWorldSpaceYaw(rawYaw, rawRoll, gyroGravity);
        }
        const yawSpeed = Math.abs(rawYaw);
        const pitchSpeed = Math.abs(rawPitch);
        const yawCutoff = gyroCutoffFactor(yawSpeed);
        const pitchCutoff = gyroCutoffFactor(pitchSpeed);
        const yawSens = gyroSensitivityCurve(yawSpeed);
        const pitchSens = gyroSensitivityCurve(pitchSpeed) * pitchSensitivityScale;
        const targetX = clamp((rawYaw * yawSens / axisScale) * yawCutoff, -1, 1);
        const targetY = clamp((rawPitch * pitchSens / axisScale) * pitchCutoff, -1, 1);
        const smoothed = applyGyroSmoothing(targetX, targetY, Math.max(yawSpeed, pitchSpeed), dt);
        let x = smoothed.x * CONFIG.gyro.sensitivityMultiplier;
        let y = smoothed.y * CONFIG.gyro.sensitivityMultiplier;
        x = clamp(x, -1, 1);
        y = clamp(y, -1, 1);
        if (invertYaw) x = -x;
        if (invertPitch) y = -y;
        return { x, y };
    }
    // =========================================================================
    // GAMEPAD EMULATION
    // =========================================================================
    function dispatchGamepadEvent(type) {
        let event;
        if (typeof GamepadEvent !== 'undefined') {
            try {
                event = new GamepadEvent(type, { gamepad: simulatedGamepad });
            } catch (e) {
                event = new Event(type);
                Object.defineProperty(event, "gamepad", { value: simulatedGamepad, configurable: true });
            }
        } else {
            event = new Event(type);
            Object.defineProperty(event, "gamepad", { value: simulatedGamepad, configurable: true });
        }
        window.dispatchEvent(event);
    }
    navigator.getGamepads = function () {
        const gamepads = realGamepads();
        simulatedGamepad.timestamp = performance.now();
        const gyro = getGyroContribution();
        if (gamepads[0] && !controllerEnable) {
            const gamepad = gamepads[0];
            toggleButton.style.background = CONFIG.toggleButton.colorOn;
            simulatedGamepad.buttons = gamepad.buttons.map(btn => ({ pressed: btn.pressed, touched: btn.touched, value: btn.value }));
            simulatedGamepad.axes = [...gamepad.axes];
            simulatedGamepad.vibrationActuator = gamepad.vibrationActuator || null;
            if (Math.abs(simulatedStick.x1) > 0.001 || Math.abs(simulatedStick.y1) > 0.001) {
                simulatedGamepad.axes[0] = simulatedStick.x1;
                simulatedGamepad.axes[1] = simulatedStick.y1;
            }
            if (trackpadCooldown > 0 || gyro.x !== 0 || gyro.y !== 0) {
                trackpadCooldown--;
                simulatedGamepad.axes[2] = clamp(simulatedStick.x2 + gyro.x, -1, 1);
                simulatedGamepad.axes[3] = clamp(simulatedStick.y2 + gyro.y, -1, 1);
            }
        } else if (controllerEnable) {
            toggleButton.style.background = CONFIG.toggleButton.colorOn;
            simulatedGamepad.vibrationActuator = virtualVibrationActuator;
            const combinedX2 = clamp(simulatedStick.x2 + gyro.x, -1, 1);
            const combinedY2 = clamp(simulatedStick.y2 + gyro.y, -1, 1);
            simulatedGamepad.axes = [simulatedStick.x1, simulatedStick.y1, combinedX2, combinedY2, 0, 0];
        }
        return [simulatedGamepad];
    };
    function gameLoop() {
        if (trackpadActive && trackpadCooldown > 0) {
            trackpadCooldown--;
            if (trackpadCooldown === 0) {
                simulatedStick.x2 = 0;
                simulatedStick.y2 = 0;
            }
        }
        if (trackpadActive && trackpadLastMoveTime > 0) {
            const idleFor = performance.now() - trackpadLastMoveTime;
            const zoneDelay = CONFIG.trackpad.returnToZeroDelayMs[trackpadZone] ?? 0;
            if (idleFor > zoneDelay) {
                simulatedStick.x2 *= CONFIG.trackpad.idleDecayRate;
                simulatedStick.y2 *= CONFIG.trackpad.idleDecayRate;
                if (Math.abs(simulatedStick.x2) < 0.01) simulatedStick.x2 = 0;
                if (Math.abs(simulatedStick.y2) < 0.01) simulatedStick.y2 = 0;
            }
        }
        if (trackpadCoasting) {
            const now = performance.now();
            const dt = Math.max(0, (now - trackpadCoastLastFrameTime) / 1000);
            trackpadCoastLastFrameTime = now;
            const decay = Math.exp(-CONFIG.trackpad.coastFrictionPerSecond * dt);
            simulatedStick.x2 *= decay;
            simulatedStick.y2 *= decay;
            if (Math.hypot(simulatedStick.x2, simulatedStick.y2) < 0.01) {
                simulatedStick.x2 = 0;
                simulatedStick.y2 = 0;
                trackpadCoasting = false;
            }
        }
        requestAnimationFrame(gameLoop);
    }
    // =========================================================================
    // BUTTONS
    // =========================================================================
    const createButton = (text, styles, eventListeners) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('gyropad-el');
        Object.assign(button.style, styles);
        for (const event in eventListeners) {
            button.addEventListener(event, eventListeners[event]);
        }
        return button;
    };
    const createVirtualButton = (text, cfg) => {
        const {
            color = "#FFF",
            width = "10vh",
            height = "10vh",
            borderRadius = "50%",
            fontSize = "3vh",
            glyph,
            x, y
        } = cfg;
        const style = {
            background: FILL_BG,
            position: "fixed",
            width,
            height,
            borderRadius,
            border: `${CONFIG.borderWidth} solid ${CONFIG.borderColor}`,
            boxSizing: "border-box",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            WebkitTouchCallout: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            color,
            fontSize,
            fontFamily: "Arial, sans-serif",
            touchAction: "none",
            display: "none",
            textAlign: "center",
            zIndex: Z_UI,
            left: x,
            bottom: y
        };
        const baseTransform = "translate(-50%, 50%)";
        style.transform = baseTransform;
        const button = createButton(glyph ?? text, style, {});
        button.setAttribute('tabindex', '-1');
        const buttonIndex = BUTTON_INDEX[text] ?? -1;
        const pressButton = () => {
            button.style.filter = "brightness(150%)";
            button.style.transform = `${baseTransform} scale(0.95)`.trim();
            button.style.transition = "all 0.1s";
            hapticTap();
            if (buttonIndex >= 0) {
                simulatedGamepad.buttons[buttonIndex] = { pressed: true, touched: true, value: 1 };
                simulatedGamepad.timestamp = performance.now();
            }
        };
        const releaseButton = () => {
            button.style.filter = "brightness(100%)";
            button.style.transform = `${baseTransform} scale(1)`.trim();
            if (buttonIndex >= 0) {
                simulatedGamepad.buttons[buttonIndex] = { pressed: false, touched: false, value: 0 };
                simulatedGamepad.timestamp = performance.now();
            }
        };
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pressButton();
        }, { passive: false });
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            releaseButton();
        }, { passive: false });
        return button;
    };
    // =========================================================================
    // ANALOG STICKS
    // =========================================================================
    const createStickContainer = (isLeft, stickCfg) => {
        const container = document.createElement('div');
        container.classList.add('gyropad-el');
        container.style.position = "fixed";
        container.style.width = stickCfg.size;
        container.style.height = stickCfg.size;
        container.style.background = FILL_BG;
        container.style.borderRadius = "50%";
        container.style.border = `${CONFIG.borderWidth} solid ${CONFIG.borderColor}`;
        container.style.boxSizing = "border-box";
        container.style.display = "none";
        container.style.zIndex = Z_UI;
        container.style.touchAction = "none";
        container.style.outline = "none";
        container.style.WebkitTapHighlightColor = "transparent";
        container.style.userSelect = "none";
        container.style.left = stickCfg.x;
        container.style.bottom = stickCfg.y;
        const baseTransform = "translate(-50%, 50%)";
        container.style.transform = baseTransform;
        const stick = document.createElement('div');
        stick.classList.add('gyropad-el');
        stick.style.position = "absolute";
        stick.style.width = "50%";
        stick.style.height = "50%";
        stick.style.background = "#fff";
        stick.style.opacity = 0.95;
        stick.style.borderRadius = "50%";
        stick.style.display = "flex";
        stick.style.justifyContent = "center";
        stick.style.alignItems = "center";
        stick.style.left = "25%";
        stick.style.top = "25%";
        stick.style.transition = "transform 0.1s";
        stick.style.touchAction = "none";
        container.appendChild(stick);
        let activeTouchId = null;
        let lastTapTime = 0;
        let pendingClickTimeout = null;
        const CLICK_DELAY_MS = 300;
        const stickButtonIndex = isLeft ? 10 : 11;
        function triggerStickClick() {
            hapticTap(CONFIG.vibration.stickClickMs);
            simulatedGamepad.buttons[stickButtonIndex] = { pressed: true, touched: true, value: 1 };
            simulatedGamepad.timestamp = performance.now();
            const originalBoxShadow = stick.style.boxShadow;
            stick.style.boxShadow = "0 0 10px 4px rgba(255,255,255,0.8)";
            setTimeout(() => {
                simulatedGamepad.buttons[stickButtonIndex] = { pressed: false, touched: false, value: 0 };
                simulatedGamepad.timestamp = performance.now();
                stick.style.boxShadow = originalBoxShadow;
            }, 120);
        }
        function updateStick(clientX, clientY) {
            const containerRect = container.getBoundingClientRect();
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;
            const dx = clientX - containerRect.left - centerX;
            const dy = clientY - containerRect.top - centerY;
            let normX = dx / STICK_RADIUS;
            let normY = dy / STICK_RADIUS;
            const magnitude = Math.hypot(normX, normY);
            if (magnitude > 1) {
                normX /= magnitude;
                normY /= magnitude;
            }
            const realDistance = Math.hypot(dx, dy);
            const clampedDistance = Math.min(realDistance, STICK_RADIUS);
            const angle = Math.atan2(dy, dx);
            const dispX = Math.cos(angle) * clampedDistance;
            const dispY = Math.sin(angle) * clampedDistance;
            stick.style.transform = `translate(${dispX}px, ${dispY}px)`;
            simulatedStick[isLeft ? 'x1' : 'x2'] = normX;
            simulatedStick[isLeft ? 'y1' : 'y2'] = normY;
            simulatedGamepad.timestamp = performance.now();
        }
        function resetStick() {
            activeTouchId = null;
            stick.style.transition = "all 0.1s";
            stick.style.transform = 'translate(0, 0)';
            container.style.filter = "brightness(100%)";
            container.style.transform = `${baseTransform} scale(1)`;
            simulatedStick[isLeft ? 'x1' : 'x2'] = 0;
            simulatedStick[isLeft ? 'y1' : 'y2'] = 0;
            simulatedGamepad.timestamp = performance.now();
        }
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            for (let touch of e.changedTouches) {
                if (container.contains(touch.target)) {
                    activeTouchId = touch.identifier;
                    break;
                }
            }
            container.style.filter = "brightness(150%)";
            container.style.transform = `${baseTransform} scale(0.95)`;
            container.style.transition = "all 0.1s";
            hapticTap();
            const now = Date.now();
            if (now - lastTapTime < CONFIG.doubleTapMs) {
                lastTapTime = 0;
                if (pendingClickTimeout) clearTimeout(pendingClickTimeout);
                pendingClickTimeout = setTimeout(() => {
                    triggerStickClick();
                    pendingClickTimeout = null;
                }, CLICK_DELAY_MS);
            } else {
                lastTapTime = now;
            }
        }, { passive: false });
        container.addEventListener('touchmove', (e) => {
            if (activeTouchId === null) return;
            stick.style.transition = "none";
            const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId);
            if (touch) updateStick(touch.clientX, touch.clientY);
        }, { passive: false });
        container.addEventListener('touchend', (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId);
            if (!touch) return;
            resetStick();
        }, { passive: false });
        container.addEventListener('touchcancel', (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId);
            if (!touch) return;
            resetStick();
        }, { passive: false });
        return container;
    };
    // =========================================================================
    // D-PAD
    // =========================================================================
    function roundedPolygonPath(points, radius) {
        const n = points.length;
        let d = "";
        for (let i = 0; i < n; i++) {
            const curr = points[i];
            const prev = points[(i - 1 + n) % n];
            const next = points[(i + 1) % n];
            const toPrev = [prev[0] - curr[0], prev[1] - curr[1]];
            const toNext = [next[0] - curr[0], next[1] - curr[1]];
            const lenPrev = Math.hypot(toPrev[0], toPrev[1]);
            const lenNext = Math.hypot(toNext[0], toNext[1]);
            const r = Math.min(radius, lenPrev / 2, lenNext / 2);
            const start = [curr[0] + (toPrev[0] / lenPrev) * r, curr[1] + (toPrev[1] / lenPrev) * r];
            const end = [curr[0] + (toNext[0] / lenNext) * r, curr[1] + (toNext[1] / lenNext) * r];
            d += (i === 0 ? `M ${start[0]} ${start[1]} ` : `L ${start[0]} ${start[1]} `);
            d += `Q ${curr[0]} ${curr[1]} ${end[0]} ${end[1]} `;
        }
        return d + "Z";
    }
    const createDPad = (cfg) => {
        const {
            color = "#FFF",
            size = "26vh",
            armThickness = "34%",
            cornerRadius = 6,
            fontSize = "3vh",
            x, y
        } = cfg;
        const container = document.createElement('div');
        container.classList.add('gyropad-el');
        container.style.position = "fixed";
        container.style.width = size;
        container.style.height = size;
        container.style.display = "none";
        container.style.zIndex = Z_UI;
        container.style.touchAction = "none";
        container.style.outline = "none";
        container.style.WebkitTapHighlightColor = "transparent";
        container.style.userSelect = "none";
        container.style.left = x;
        container.style.bottom = y;
        const baseTransform = "translate(-50%, 50%)";
        container.style.transform = baseTransform;
        const t = parseFloat(armThickness);
        const a = t, b = 100 - t;
        const crossPoints = [
            [a, 0], [b, 0], [b, a], [100, a], [100, b], [b, b],
            [b, 100], [a, 100], [a, b], [0, b], [0, a], [a, a]
        ];
        const pathData = roundedPolygonPath(crossPoints, cornerRadius);
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("preserveAspectRatio", "none");
        Object.assign(svg.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", FILL_BG);
        path.setAttribute("stroke", CONFIG.borderColor);
        path.setAttribute("stroke-width", parseFloat(CONFIG.borderWidth) || 2);
        path.setAttribute("vector-effect", "non-scaling-stroke");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
        container.appendChild(svg);
        const armRects = {
            "↑": { left: `${a}%`, top: "0%", width: `${b - a}%`, height: `${a}%` },
            "↓": { left: `${a}%`, top: `${b}%`, width: `${b - a}%`, height: `${a}%` },
            "←": { left: "0%", top: `${a}%`, width: `${a}%`, height: `${b - a}%` },
            "→": { left: `${b}%`, top: `${a}%`, width: `${a}%`, height: `${b - a}%` }
        };
        const armElements = {};
        for (const [dir, rect] of Object.entries(armRects)) {
            const armEl = document.createElement('div');
            armEl.textContent = dir;
            Object.assign(armEl.style, {
                position: "absolute",
                left: rect.left, top: rect.top, width: rect.width, height: rect.height,
                display: "flex", alignItems: "center", justifyContent: "center",
                color, fontSize, fontFamily: "Arial, sans-serif",
                background: "transparent",
                transition: "background 0.08s",
                pointerEvents: "none"
            });
            container.appendChild(armEl);
            armElements[dir] = armEl;
        }
        let activeTouchId = null;
        let activeDir = null;
        const centerDeadzoneFraction = 0.12;
        function getDirection(clientX, clientY) {
            const rect = container.getBoundingClientRect();
            const dx = clientX - (rect.left + rect.width / 2);
            const dy = clientY - (rect.top + rect.height / 2);
            if (Math.hypot(dx, dy) < rect.width * centerDeadzoneFraction) return null;
            return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "→" : "←") : (dy > 0 ? "↓" : "↑");
        }
        function pressDir(dir) {
            const idx = BUTTON_INDEX[dir];
            hapticTap();
            simulatedGamepad.buttons[idx] = { pressed: true, touched: true, value: 1 };
            simulatedGamepad.timestamp = performance.now();
            armElements[dir].style.background = "rgba(255,255,255,0.35)";
        }
        function releaseDir(dir) {
            const idx = BUTTON_INDEX[dir];
            simulatedGamepad.buttons[idx] = { pressed: false, touched: false, value: 0 };
            simulatedGamepad.timestamp = performance.now();
            armElements[dir].style.background = "transparent";
        }
        function setDirection(dir) {
            if (dir === activeDir) return;
            if (activeDir) releaseDir(activeDir);
            activeDir = dir;
            if (dir) pressDir(dir);
        }
        function endTouch(e) {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId);
            if (!touch) return;
            activeTouchId = null;
            setDirection(null);
            container.style.filter = "brightness(100%)";
        }
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            activeTouchId = touch.identifier;
            container.style.filter = "brightness(120%)";
            setDirection(getDirection(touch.clientX, touch.clientY));
        }, { passive: false });
        container.addEventListener('touchmove', (e) => {
            if (activeTouchId === null) return;
            const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId);
            if (!touch) return;
            e.preventDefault();
            setDirection(getDirection(touch.clientX, touch.clientY));
        }, { passive: false });
        container.addEventListener('touchend', endTouch, { passive: false });
        container.addEventListener('touchcancel', endTouch, { passive: false });
        return container;
    };
    // =========================================================================
    // TRACKPAD
    // =========================================================================
    const createTrackpad = () => {
        const container = document.createElement('div');
        container.style.position = "fixed";
        container.style.width = "100vw";
        container.style.height = "100vh";
        container.style.background = "rgba(30, 30, 30, 0.01)";
        container.style.opacity = DEFAULT_OPACITY;
        container.style.borderRadius = "0";
        container.style.top = "0";
        container.style.left = "0";
        container.style.display = "none";
        container.style.zIndex = Z_PAD;
        container.style.overflow = "hidden";
        container.style.border = "none";
        container.style.touchAction = "none";
        const grid = document.createElement('div');
        grid.style.position = "absolute";
        grid.style.width = "100%";
        grid.style.height = "100%";
        grid.style.backgroundImage = "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)";
        grid.style.backgroundSize = "20% 20%";
        container.appendChild(grid);
        let lastX = 0;
        let lastY = 0;
        let originX = 0;
        let originY = 0;
        let radialActivity = 0;
        function resetTrackpad() {
            trackpadActive = false;
            trackpadTouchId = null;
            trackpadCooldown = 0;
            trackpadLastMoveTime = 0;
            trackpadZone = 'inner';
            container.style.filter = "brightness(100%)";
            const hasMomentum = Math.hypot(simulatedStick.x2, simulatedStick.y2) > 0.02;
            if (CONFIG.trackpad.coastOnRelease && hasMomentum) {
                trackpadCoasting = true;
                trackpadCoastLastFrameTime = performance.now();
            } else {
                simulatedStick.x2 = 0;
                simulatedStick.y2 = 0;
                trackpadCoasting = false;
            }
        }
        function computeRadialTurn(clientX, clientY) {
            const { innerRadius, outerRadius, outerZoneStrength, curve } = CONFIG.trackpad;
            const dx = clientX - originX;
            const dy = clientY - originY;
            const radius = Math.hypot(dx, dy);
            if (radius <= innerRadius || outerRadius <= innerRadius) return { x: 0, y: 0 };
            const t = clamp((radius - innerRadius) / (outerRadius - innerRadius), 0, 1);
            const shaped = Math.pow(t, curve) * outerZoneStrength;
            return { x: (dx / radius) * shaped, y: (dy / radius) * shaped };
        }
        function computeVelocityRamp(speed) {
            const { velocityRampStart, velocityRampEnd, velocityRampMax } = CONFIG.trackpad;
            if (speed <= velocityRampStart || velocityRampEnd <= velocityRampStart) return 0;
            const t = clamp((speed - velocityRampStart) / (velocityRampEnd - velocityRampStart), 0, 1);
            return t * velocityRampMax;
        }
        function dynamicSmoothing(speed) {
            const { smoothingSlow, smoothingFast, smoothingRampStart, smoothingRampEnd } = CONFIG.trackpad;
            if (smoothingRampEnd <= smoothingRampStart) return smoothingSlow;
            const t = clamp((speed - smoothingRampStart) / (smoothingRampEnd - smoothingRampStart), 0, 1);
            return smoothingSlow + (smoothingFast - smoothingSlow) * t;
        }
        function applyAccelClamp(target, previous) {
            const maxDelta = CONFIG.trackpad.maxDeltaPerFrame;
            return clamp(target, previous - maxDelta, previous + maxDelta);
        }
        function processMove(clientX, clientY) {
            const now = performance.now();
            const dt = Math.max(1, now - trackpadLastMoveTime);
            const dx = clientX - lastX;
            const dy = clientY - lastY;
            lastX = clientX;
            lastY = clientY;
            trackpadLastMoveTime = now;
            const { sensitivityX, sensitivityY, curve, deadzone, radialActivitySpeedThreshold, minimumOutputMagnitude, sensitivityMultiplier } = CONFIG.trackpad;
            const velX = (dx / dt) * 16.67;
            const velY = (dy / dt) * 16.67;
            const speed = Math.hypot(velX, velY);
            let microX = clamp((velX / 80) * sensitivityX * sensitivityMultiplier, -1, 1);
            let microY = clamp((velY / 80) * sensitivityY * sensitivityMultiplier, -1, 1);
            microX = Math.sign(microX) * Math.pow(Math.abs(microX), curve);
            microY = Math.sign(microY) * Math.pow(Math.abs(microY), curve);
            const activityTarget = speed > radialActivitySpeedThreshold ? 1 : 0;
            const activityRate = activityTarget > radialActivity ? 0.5 : 0.12;
            radialActivity += (activityTarget - radialActivity) * activityRate;
            const { innerRadius, outerRadius } = CONFIG.trackpad;
            const radiusFromOrigin = Math.hypot(clientX - originX, clientY - originY);
            trackpadZone = radiusFromOrigin <= innerRadius ? 'inner' : (radiusFromOrigin <= outerRadius ? 'mid' : 'outer');
            const radialGate = trackpadZone === 'outer' ? 1 : radialActivity;
            const radial = computeRadialTurn(clientX, clientY);
            const ramp = computeVelocityRamp(speed);
            const rampX = (speed > 0 ? (velX / speed) * ramp : 0) * sensitivityMultiplier;
            const rampY = (speed > 0 ? (velY / speed) * ramp : 0) * sensitivityMultiplier;
            let targetX = clamp(microX + radial.x * radialGate * sensitivityMultiplier + rampX, -1, 1);
            let targetY = clamp(microY + radial.y * radialGate * sensitivityMultiplier + rampY, -1, 1);
            if (Math.abs(targetX) < deadzone) targetX = 0;
            if (Math.abs(targetY) < deadzone) targetY = 0;
            const targetMagnitude = Math.hypot(targetX, targetY);
            if (targetMagnitude > 0 && targetMagnitude < minimumOutputMagnitude) {
                const floorScale = minimumOutputMagnitude / targetMagnitude;
                targetX *= floorScale;
                targetY *= floorScale;
            }
            const smoothing = dynamicSmoothing(speed);
            const smoothedX = simulatedStick.x2 * smoothing + targetX * (1 - smoothing);
            const smoothedY = simulatedStick.y2 * smoothing + targetY * (1 - smoothing);
            simulatedStick.x2 = applyAccelClamp(smoothedX, simulatedStick.x2);
            simulatedStick.y2 = applyAccelClamp(smoothedY, simulatedStick.y2);
            trackpadCooldown = CONFIG.trackpad.holdFrames;
        }
        container.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            if (e.target !== container && e.target !== grid) return;
            trackpadTouchId = touch.identifier;
            trackpadActive = true;
            trackpadCoasting = false;
            lastX = touch.clientX;
            lastY = touch.clientY;
            originX = touch.clientX;
            originY = touch.clientY;
            radialActivity = 0;
            trackpadZone = 'inner';
            trackpadLastMoveTime = performance.now();
            container.style.filter = "brightness(130%)";
        }, { passive: true });
        container.addEventListener('touchmove', (e) => {
            if (!trackpadActive || trackpadTouchId === null) return;
            const touch = Array.from(e.touches).find(t => t.identifier === trackpadTouchId);
            if (!touch) return;
            processMove(touch.clientX, touch.clientY);
        }, { passive: true });
        container.addEventListener('touchend', (e) => {
            if (!trackpadActive || trackpadTouchId === null) return;
            const touch = Array.from(e.changedTouches).find(t => t.identifier === trackpadTouchId);
            if (touch) resetTrackpad();
        }, { passive: true });
        container.addEventListener('touchcancel', (e) => {
            resetTrackpad();
        }, { passive: true });
        return container;
    };
    // =========================================================================
    // STYLES
    // =========================================================================
    function injectGlobalResetStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .gyropad-el, .gyropad-el * {
                outline: none !important;
                -webkit-tap-highlight-color: transparent !important;
                -webkit-touch-callout: none !important;
            }
            .gyropad-el:focus, .gyropad-el:active {
                outline: none !important;
            }
            body.gyropad-editing .gyropad-editable {
                box-shadow: 0 0 0 3px rgba(255, 210, 0, 0.9) !important;
            }
            .gyropad-resize-handle {
                display: none;
                position: absolute;
                right: -1.2vh;
                bottom: -1.2vh;
                width: 3vh;
                height: 3vh;
                border-radius: 50%;
                background: rgba(255, 210, 0, 0.95);
                border: 2px solid rgba(0,0,0,0.6);
                box-sizing: border-box;
                pointer-events: none;
                z-index: 1;
            }
            body.gyropad-editing .gyropad-resize-handle {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }
    // =========================================================================
    // EDIT MODE (long-press 🎮 to reposition buttons, long-press again to lock)
    // =========================================================================
    function addResizeHandle(el) {
        const handle = document.createElement('div');
        handle.classList.add('gyropad-resize-handle');
        el.appendChild(handle);
    }
    function tagEditable(el) {
        if (!el) return;
        el.classList.add('gyropad-editable');
        addResizeHandle(el);
    }
    function createEditOverlay(getDraggables) {
        const overlay = document.createElement('div');
        overlay.classList.add('gyropad-el');
        Object.assign(overlay.style, {
            position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
            zIndex: Z_UI, display: "none", touchAction: "none", background: "transparent"
        });
        let draggingEl = null;
        let draggingKey = null;
        let shiftX = 0, shiftY = 0;
        let resizingEl = null;
        let resizingKey = null;
        let resizeCenterX = 0, resizeCenterY = 0;
        let resizeStartDist = 1;
        let resizeStartWidth = 0, resizeStartHeight = 0;
        const RESIZE_ZONE_FRACTION = 0.35;
        const MIN_SCALE = 0.4, MAX_SCALE = 2.5;
        function findDraggableAt(x, y) {
            const draggables = getDraggables();
            for (const { el, key } of draggables) {
                const rect = el.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    return { el, key, rect };
                }
            }
            return null;
        }
        function isInResizeZone(rect, x, y) {
            const zoneW = rect.width * RESIZE_ZONE_FRACTION;
            const zoneH = rect.height * RESIZE_ZONE_FRACTION;
            return x >= rect.right - zoneW && y >= rect.bottom - zoneH;
        }
        overlay.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const hit = findDraggableAt(touch.clientX, touch.clientY);
            if (!hit) return;
            e.preventDefault();
            if (isInResizeZone(hit.rect, touch.clientX, touch.clientY)) {
                resizingEl = hit.el;
                resizingKey = hit.key;
                resizeCenterX = hit.rect.left + hit.rect.width / 2;
                resizeCenterY = hit.rect.top + hit.rect.height / 2;
                resizeStartDist = Math.max(20, Math.hypot(touch.clientX - resizeCenterX, touch.clientY - resizeCenterY));
                resizeStartWidth = hit.rect.width;
                resizeStartHeight = hit.rect.height;
                resizingEl.style.transition = "none";
            } else {
                draggingEl = hit.el;
                draggingKey = hit.key;
                shiftX = touch.clientX - (hit.rect.left + hit.rect.width / 2);
                shiftY = touch.clientY - (hit.rect.top + hit.rect.height / 2);
                draggingEl.style.transition = "none";
            }
        }, { passive: false });
        overlay.addEventListener('touchmove', (e) => {
            if (!draggingEl && !resizingEl) return;
            e.preventDefault();
            const touch = e.touches[0];
            if (resizingEl) {
                const dist = Math.hypot(touch.clientX - resizeCenterX, touch.clientY - resizeCenterY);
                const scale = clamp(dist / resizeStartDist, MIN_SCALE, MAX_SCALE);
                resizingEl.style.width = (resizeStartWidth * scale).toFixed(1) + "px";
                resizingEl.style.height = (resizeStartHeight * scale).toFixed(1) + "px";
                return;
            }
            const cx = touch.clientX - shiftX;
            const cy = touch.clientY - shiftY;
            const xPercent = clamp((cx / window.innerWidth) * 100, 0, 100);
            const yPercent = clamp(((window.innerHeight - cy) / window.innerHeight) * 100, 0, 100);
            draggingEl.style.left = xPercent.toFixed(2) + "%";
            draggingEl.style.bottom = yPercent.toFixed(2) + "%";
        }, { passive: false });
        function endDrag() {
            if (draggingEl) {
                const existing = layoutOverrides[draggingKey] || {};
                layoutOverrides[draggingKey] = {
                    x: draggingEl.style.left,
                    y: draggingEl.style.bottom,
                    width: existing.width,
                    height: existing.height
                };
                persistLayout();
            }
            if (resizingEl) {
                const existing = layoutOverrides[resizingKey] || {};
                layoutOverrides[resizingKey] = {
                    x: existing.x || resizingEl.style.left,
                    y: existing.y || resizingEl.style.bottom,
                    width: resizingEl.style.width,
                    height: resizingEl.style.height
                };
                persistLayout();
            }
            draggingEl = null;
            draggingKey = null;
            resizingEl = null;
            resizingKey = null;
        }
        overlay.addEventListener('touchend', endDrag, { passive: false });
        overlay.addEventListener('touchcancel', endDrag, { passive: false });
        return overlay;
    }
    function createSensitivityPanel(actions) {
        const panel = document.createElement('div');
        panel.classList.add('gyropad-el');
        Object.assign(panel.style, {
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            display: "none", flexDirection: "column", gap: "10px",
            background: "rgba(20,20,20,0.88)", border: `${CONFIG.borderWidth} solid ${CONFIG.borderColor}`,
            borderRadius: "12px", padding: "16px 20px", zIndex: Z_UI, color: "#fff",
            fontFamily: "Arial, sans-serif", fontSize: "2.4vh", touchAction: "none"
        });
        function makeRow(label, getVal, setVal) {
            const row = document.createElement('div');
            Object.assign(row.style, { display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" });
            const lbl = document.createElement('span');
            lbl.textContent = label;
            const minus = document.createElement('button');
            minus.textContent = "−";
            const val = document.createElement('span');
            val.style.minWidth = "5ch";
            val.style.textAlign = "center";
            const plus = document.createElement('button');
            plus.textContent = "+";
            [minus, plus].forEach(b => {
                b.classList.add('gyropad-el');
                Object.assign(b.style, {
                    width: "5.5vh", height: "5.5vh", borderRadius: "50%",
                    border: `${CONFIG.borderWidth} solid ${CONFIG.borderColor}`,
                    background: FILL_BG, color: "#fff", fontSize: "3vh", touchAction: "none"
                });
            });
            function refresh() { val.textContent = getVal().toFixed(1) + "x"; }
            minus.addEventListener('touchstart', (e) => {
                e.preventDefault(); e.stopPropagation();
                setVal(clamp(getVal() - 0.1, 0.3, 3.0));
                refresh();
                persistSensitivity();
            }, { passive: false });
            plus.addEventListener('touchstart', (e) => {
                e.preventDefault(); e.stopPropagation();
                setVal(clamp(getVal() + 0.1, 0.3, 3.0));
                refresh();
                persistSensitivity();
            }, { passive: false });
            refresh();
            row.appendChild(lbl); row.appendChild(minus); row.appendChild(val); row.appendChild(plus);
            return row;
        }
        function makeActionButton(label, onTap) {
            const btn = document.createElement('button');
            btn.classList.add('gyropad-el');
            btn.textContent = label;
            Object.assign(btn.style, {
                width: "100%", padding: "10px 0", borderRadius: "8px",
                border: `${CONFIG.borderWidth} solid ${CONFIG.borderColor}`,
                background: FILL_BG, color: "#fff", fontSize: "2.2vh", touchAction: "none"
            });
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); e.stopPropagation();
                onTap();
            }, { passive: false });
            return btn;
        }
        const title = document.createElement('div');
        title.textContent = "Sensitivity";
        title.style.textAlign = "center";
        title.style.opacity = "0.8";
        title.style.marginBottom = "4px";
        panel.appendChild(title);
        panel.appendChild(makeRow("Trackpad", () => CONFIG.trackpad.sensitivityMultiplier, (v) => { CONFIG.trackpad.sensitivityMultiplier = v; }));
        panel.appendChild(makeRow("Gyro", () => CONFIG.gyro.sensitivityMultiplier, (v) => { CONFIG.gyro.sensitivityMultiplier = v; }));
        const divider = document.createElement('div');
        Object.assign(divider.style, { borderTop: "1px solid rgba(255,255,255,0.25)", margin: "6px 0" });
        panel.appendChild(divider);
        panel.appendChild(makeActionButton("Toggle Right Stick", () => actions.onToggleRightStick()));
        panel.appendChild(makeActionButton("Reset Layout (this preset)", () => actions.onResetLayout()));
        return panel;
    }
    // =========================================================================
    // UI ASSEMBLY
    // =========================================================================
    function createUI() {
        let buttons = {};
        let stickLeftContainer = null;
        let stickRightContainer = null;
        let dpad = null;
        function buildPadElementsFromPreset() {
            const resolved = resolvePresetLayout(currentPresetIndex);
            buttons = {};
            for (const [label, cfg] of Object.entries(resolved.buttons)) {
                buttons[label] = createVirtualButton(label, cfg);
                tagEditable(buttons[label]);
            }
            stickLeftContainer = createStickContainer(true, resolved.sticks.left);
            tagEditable(stickLeftContainer);
            stickRightContainer = resolved.sticks.right.enabled ? createStickContainer(false, resolved.sticks.right) : null;
            if (stickRightContainer) tagEditable(stickRightContainer);
            dpad = createDPad(resolved.dpad);
            tagEditable(dpad);
        }
        buildPadElementsFromPreset();
        let trackpadContainer = createTrackpad();
        function getAllPadElements() {
            return [
                ...Object.values(buttons),
                stickLeftContainer, stickRightContainer, trackpadContainer, dpad
            ].filter(Boolean);
        }
        function getDraggables() {
            const list = Object.entries(buttons).map(([key, el]) => ({ el, key }));
            list.push({ el: stickLeftContainer, key: 'LEFT_STICK' });
            if (stickRightContainer) list.push({ el: stickRightContainer, key: 'RIGHT_STICK' });
            list.push({ el: dpad, key: 'DPAD' });
            return list;
        }
        const editOverlay = createEditOverlay(getDraggables);
        function rebuildPadElementsForPreset() {
            [...Object.values(buttons), stickLeftContainer, stickRightContainer, dpad]
                .filter(Boolean)
                .forEach(el => el.remove());
            buildPadElementsFromPreset();
            const parent = getGameContainer();
            const display = controllerEnable ? "block" : "none";
            [...Object.values(buttons), stickLeftContainer, stickRightContainer, dpad]
                .filter(Boolean)
                .forEach(el => {
                    el.style.display = display;
                    parent.appendChild(el);
                });
            parent.appendChild(editOverlay);
            parent.appendChild(toggleButton);
            parent.appendChild(sensitivityPanel);
        }
        function cyclePreset() {
            currentPresetIndex = (currentPresetIndex + 1) % PRESET_COUNT;
            layoutOverrides = presetOverrides[currentPresetIndex];
            rebuildPadElementsForPreset();
            persistPresetIndex();
            hapticTap(CONFIG.vibration.editModeMs);
            showToast(`Preset ${currentPresetIndex + 1} / ${PRESET_COUNT}`);
        }
        function toggleRightStick() {
            const currentlyEnabled = resolvePresetLayout(currentPresetIndex).sticks.right.enabled;
            if (!layoutOverrides.RIGHT_STICK) layoutOverrides.RIGHT_STICK = {};
            layoutOverrides.RIGHT_STICK.enabled = !currentlyEnabled;
            persistLayout();
            rebuildPadElementsForPreset();
            hapticTap();
            showToast(`Right Stick: ${!currentlyEnabled ? "Visible" : "Hidden"}`);
        }
        function resetCurrentPresetLayout() {
            presetOverrides[currentPresetIndex] = {};
            layoutOverrides = presetOverrides[currentPresetIndex];
            persistLayout();
            rebuildPadElementsForPreset();
            hapticTap(CONFIG.vibration.editModeMs);
            showToast(`Preset ${currentPresetIndex + 1} reset to script defaults`);
        }
        sensitivityPanel = createSensitivityPanel({
            onToggleRightStick: toggleRightStick,
            onResetLayout: resetCurrentPresetLayout
        });
        toggleButton = document.createElement("button");
        toggleButton.textContent = "🎮";
        toggleButton.classList.add('gyropad-el');
        toggleButton.style.position = "fixed";
        toggleButton.style.fontSize = "4vh";
        toggleButton.style.textAlign = "center";
        toggleButton.style.fontFamily = "Arial, sans-serif";
        toggleButton.style.top = CONFIG.toggleButton.top;
        toggleButton.style.right = CONFIG.toggleButton.right;
        toggleButton.style.background = controllerEnable ? CONFIG.toggleButton.colorOn : CONFIG.toggleButton.colorOff;
        toggleButton.style.opacity = CONFIG.toggleButton.opacity;
        toggleButton.style.color = "#FFF";
        toggleButton.style.border = `${CONFIG.borderWidth} solid ${CONFIG.borderColor}`;
        toggleButton.style.boxSizing = "border-box";
        toggleButton.style.borderRadius = "50%";
        toggleButton.style.width = CONFIG.toggleButton.size;
        toggleButton.style.height = CONFIG.toggleButton.size;
        toggleButton.style.zIndex = Z_UI;
        toggleButton.style.touchAction = "none";
        toggleButton.style.outline = "none";
        function showControls() {
            controllerEnable = true;
            toggleButton.style.background = CONFIG.toggleButton.colorOn;
            getAllPadElements().forEach(el => { el.style.display = "block"; });
        }
        function hideControls() {
            controllerEnable = false;
            toggleButton.style.background = CONFIG.toggleButton.colorOff;
            getAllPadElements().forEach(el => { el.style.display = "none"; });
        }
        function toggleController() {
            if (screen.orientation.type.includes('landscape')) {
                let gamepads = realGamepads();
                if (gamepads[0]) {
                    showToast("There Is A Real Gamepad Connected 🎮 So Virtual Gamepad is Not Available 🚫");
                } else {
                    controllerEnable = !controllerEnable;
                    if (controllerEnable) {
                        dispatchGamepadEvent("gamepadconnected");
                        showControls();
                    } else {
                        dispatchGamepadEvent("gamepaddisconnected");
                        hideControls();
                    }
                }
            } else {
                showToast("Only In Landscape Orientation");
            }
        }
        function toggleEditMode() {
            if (!editMode && realGamepads()[0]) {
                showToast("There Is A Real Gamepad Connected 🎮 So Edit Mode is Not Available 🚫");
                return;
            }
            editMode = !editMode;
            if (editMode) {
                if (!controllerEnable) {
                    dispatchGamepadEvent("gamepadconnected");
                    showControls();
                }
                document.body.classList.add('gyropad-editing');
                editOverlay.style.display = "block";
                sensitivityPanel.style.display = "flex";
                hapticTap(CONFIG.vibration.editModeMs);
                showToast("Edit Mode: drag buttons to reposition. Long-press 🎮 again to lock.");
            } else {
                document.body.classList.remove('gyropad-editing');
                editOverlay.style.display = "none";
                sensitivityPanel.style.display = "none";
                persistLayout();
                persistSensitivity();
                if (navigator.vibrate) navigator.vibrate([CONFIG.vibration.editModeMs, 60, CONFIG.vibration.editModeMs]);
                showToast("Layout locked & saved.");
            }
        }
        function showToast(message) {
            const toast = document.createElement("div");
            toast.textContent = message;
            toast.style.position = "fixed";
            toast.style.textAlign = "center";
            toast.style.bottom = "20px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.background = "rgba(0, 0, 0, 0.8)";
            toast.style.color = "white";
            toast.style.padding = "12px 20px";
            toast.style.borderRadius = "8px";
            toast.style.fontSize = "3vh";
            toast.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
            toast.style.zIndex = Z_UI;
            toast.style.opacity = "0";
            toast.style.transition = "opacity 0.5s ease-in-out";
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = "1"; }, 100);
            setTimeout(() => {
                toast.style.opacity = "0";
                setTimeout(() => { toast.remove(); }, 500);
            }, 5000);
        }
        screen.orientation.addEventListener("change", function () {
            if (screen.orientation.type.includes('portrait')) {
                hideControls();
            }
        });
        let toggleLastTapTime = 0;
        let togglePendingTapTimeout = null;
        toggleButton.addEventListener('touchstart', function (event) {
            event.preventDefault();
            let touch = event.touches[0];
            let rect = toggleButton.getBoundingClientRect();
            let shiftX = touch.clientX - rect.left;
            let shiftY = touch.clientY - rect.top;
            let startX = touch.clientX;
            let startY = touch.clientY;
            let moved = false;
            let longPressFired = false;
            const longPressTimer = setTimeout(() => {
                longPressFired = true;
                toggleEditMode();
            }, 600);
            function moveAt(clientX, clientY) {
                toggleButton.style.left = clientX - shiftX + "px";
                toggleButton.style.top = clientY - shiftY + "px";
                toggleButton.style.right = "";
            }
            function onTouchMove(event) {
                let currentTouch = event.touches[0];
                moveAt(currentTouch.clientX, currentTouch.clientY);
                if (Math.abs(currentTouch.clientX - startX) > 15 || Math.abs(currentTouch.clientY - startY) > 15) {
                    moved = true;
                    clearTimeout(longPressTimer);
                }
            }
            function onTouchEnd() {
                clearTimeout(longPressTimer);
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
                if (moved || longPressFired) return;
                const now = Date.now();
                if (now - toggleLastTapTime < CONFIG.doubleTapMs) {
                    toggleLastTapTime = 0;
                    if (togglePendingTapTimeout) {
                        clearTimeout(togglePendingTapTimeout);
                        togglePendingTapTimeout = null;
                    }
                    cyclePreset();
                } else {
                    toggleLastTapTime = now;
                    togglePendingTapTimeout = setTimeout(() => {
                        togglePendingTapTimeout = null;
                        toggleController();
                    }, CONFIG.doubleTapMs);
                }
            }
            document.addEventListener("touchmove", onTouchMove);
            document.addEventListener("touchend", onTouchEnd);
        }, { passive: false });
        function getGameContainer() {
            return document.fullscreenElement ||
                document.getElementById("fullscreen-container") ||
                document.getElementById("StreamHud") ||
                document.querySelector('video')?.closest('div[class]') ||
                document.body;
        }
        function moveToFullscreen() {
            let targetParent = getGameContainer();
            const elementsToMove = [...getAllPadElements(), editOverlay, toggleButton, sensitivityPanel];
            elementsToMove.forEach(el => {
                if (el && el.parentElement !== targetParent) {
                    targetParent.appendChild(el);
                }
            });
        }
        document.addEventListener("fullscreenchange", moveToFullscreen);
        setInterval(moveToFullscreen, 2000);
        setInterval(() => {
            if (controllerEnable) dispatchGamepadEvent("gamepadconnected");
        }, 3000);
        const initialElements = [...getAllPadElements(), editOverlay, toggleButton, sensitivityPanel];
        initialElements.forEach(el => { if (el) document.body.appendChild(el); });
        setTimeout(moveToFullscreen, 500);
    }
    // =========================================================================
    // INIT
    // =========================================================================
    createUI();
    injectGlobalResetStyles();
    setupGyro();
    gameLoop();
})();

import { ShaderLabComposition, type ShaderLabConfig } from "@basementstudio/shader-lab"

export const titleShaderConfig: ShaderLabConfig = {
  "composition": {
    "width": 700,
    "height": 120
  },
  "layers": [
    {
      "blendMode": "screen",
      "compositeMode": "filter",
      "maskConfig": {
        "invert": false,
        "mode": "multiply",
        "source": "luminance"
      },
      "hue": 0,
      "id": "83cd9b9f-7584-4779-96e1-c387bfbf55e6",
      "kind": "effect",
      "name": "Bloom",
      "opacity": 1,
      "params": {
        "bloomIntensity": 1.74,
        "bloomKnee": 0.22,
        "bloomRadius": 13.25,
        "bloomSoftness": 0.78,
        "bloomThreshold": 0.29,
        "highlightDrive": 2.67
      },
      "saturation": 1,
      "type": "bloom",
      "visible": true
    },
    {
      "blendMode": "normal",
      "compositeMode": "mask",
      "maskConfig": {
        "invert": false,
        "mode": "multiply",
        "source": "luminance"
      },
      "hue": 0,
      "id": "0e3136ed-a783-4527-888d-269caeb49a9f",
      "kind": "source",
      "name": "Text",
      "opacity": 1,
      "params": {
        "anchor": "center",
        "backgroundAlpha": 1,
        "backgroundColor": "#000000",
        "fontFamily": "adhesion",
        "fontSize": 70,
        "fontWeight": 400,
        "letterSpacing": -0.1,
        "offset": [
          0,
          0
        ],
        "text": "heymynameisrob",
        "textColor": "#ffffff"
      },
      "saturation": 1,
      "type": "text",
      "visible": true
    },
    {
      "blendMode": "screen",
      "compositeMode": "filter",
      "maskConfig": {
        "invert": false,
        "mode": "multiply",
        "source": "luminance"
      },
      "hue": 4,
      "id": "eb6dda3c-1632-44c5-9a29-d4f382a09b8d",
      "kind": "effect",
      "name": "Displacement Map",
      "opacity": 1,
      "params": {
        "channel": "luminance",
        "direction": "both",
        "midpoint": 0.23,
        "strength": 172
      },
      "saturation": 2,
      "type": "displacement-map",
      "visible": true
    },
    {
      "blendMode": "darken",
      "compositeMode": "filter",
      "maskConfig": {
        "invert": false,
        "mode": "multiply",
        "source": "luminance"
      },
      "hue": 2,
      "id": "40c39149-a3e6-4abc-a5c2-f0f4c7e2e67b",
      "kind": "effect",
      "name": "ASCII",
      "opacity": 1,
      "params": {
        "bgOpacity": 0.18,
        "boldness": 0.26,
        "breakGrid": "off",
        "breakThreshold": 0.06,
        "charset": "light",
        "colorMode": "source",
        "columns": 358,
        "customChars": " .:-=+*#%@",
        "fontFamily": "mono",
        "fontWeight": 400,
        "invert": false,
        "monoColor": "#f5f5f0",
        "rowWarp": 0,
        "signalBlackPoint": 0,
        "signalWhitePoint": 1
      },
      "saturation": 1.35,
      "type": "ascii",
      "visible": true
    },
    {
      "blendMode": "normal",
      "compositeMode": "filter",
      "maskConfig": {
        "invert": false,
        "mode": "multiply",
        "source": "luminance"
      },
      "hue": 0,
      "id": "6bfa2084-cf57-4f8a-bb49-57cfa1c74b1c",
      "kind": "effect",
      "name": "Dithering",
      "opacity": 1,
      "params": {
        "algorithm": "bayer-4x4",
        "animateDither": false,
        "chromaticSplit": false,
        "colorMode": "source",
        "ditherSpeed": 1,
        "dotScale": 1,
        "highlightColor": "#f5f2e8",
        "levels": 3,
        "monoColor": "#f5f5f0",
        "pixelSize": 1,
        "preset": "custom",
        "shadowColor": "#101010",
        "spread": 0.5
      },
      "saturation": 1,
      "type": "dithering",
      "visible": true
    },
    {
      "blendMode": "normal",
      "compositeMode": "filter",
      "maskConfig": {
        "invert": false,
        "mode": "multiply",
        "source": "luminance"
      },
      "hue": 0,
      "id": "26d26625-50e7-46c4-b5c2-977b54190abd",
      "kind": "source",
      "name": "Gradient 2",
      "opacity": 1,
      "params": {
        "preset": "sunset",
        "activePoints": 4,
        "point1Color": "#1a0a2e",
        "point1Position": [
          -0.6,
          -0.8
        ],
        "point1Weight": 0.8,
        "point2Color": "#c4420a",
        "point2Position": [
          0.3,
          0.4
        ],
        "point2Weight": 1.2,
        "point3Color": "#e8821a",
        "point3Position": [
          0.8,
          0.7
        ],
        "point3Weight": 0.9,
        "point4Color": "#4a1942",
        "point4Position": [
          -0.5,
          0.3
        ],
        "point4Weight": 1,
        "point5Color": "#F3E7D0",
        "point5Position": [
          0.58,
          -0.76
        ],
        "point5Weight": 0.48,
        "noiseType": "simplex",
        "noiseSeed": 70.3,
        "warpAmount": 0.6,
        "warpScale": 3.5,
        "warpIterations": 2,
        "warpDecay": 1.2,
        "warpBias": 0.5,
        "vortexAmount": 0,
        "animate": true,
        "motionAmount": 1,
        "motionSpeed": 0.4,
        "falloff": 3.5,
        "tonemapMode": "totos",
        "glowStrength": 0,
        "glowThreshold": 0,
        "grainAmount": 0.08,
        "vignetteStrength": 0.15,
        "vignetteRadius": 1.4,
        "vignetteSoftness": 0.8
      },
      "saturation": 1,
      "type": "gradient",
      "visible": true
    }
  ],
  "timeline": {
    "duration": 59.996,
    "loop": true,
    "tracks": []
  }
}

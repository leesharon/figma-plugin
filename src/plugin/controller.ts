/* eslint-disable indent */
import { MsgTypes } from '../enums/MsgTypes.enum'
import { colorsUtils } from './utils/colors.utils'

figma.showUI(__html__)

figma.skipInvisibleInstanceChildren = true

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case MsgTypes.GENERATE_DESIGN_SYSTEM:
            generateDesignSystem()
            break
        default:
            break
    }

    figma.closePlugin()
}

function generateDesignSystem() {
    const { selection } = figma.currentPage

    const uniqueColors = new Set<string>()

    const iterateThroughAllNodes = (nodes: readonly SceneNode[]) => {
        if (!nodes.length) return
        for (const node of nodes) {
            // Gets All Colors for the Palette
            colorsUtils.getAllUniqueColors(node, uniqueColors)

            // Handles nested children nodes
            const { type } = node
            if ((type === 'FRAME' ||
                type === 'COMPONENT' ||
                type === 'INSTANCE' ||
                type === 'GROUP') &&
                node.children.length

            ) iterateThroughAllNodes(node.children as SceneNode[])
        }
    }

    iterateThroughAllNodes(selection)

    colorsUtils.generateColorPaletteFrame([...uniqueColors])

    figma.ui.postMessage({
        type: MsgTypes.GENERATE_DESIGN_SYSTEM,
        msg: 'Created design system! Rectangles',
    })
}

// function createRectangles(msg: { count: number }) {
//     const nodes = []

//     for (let i = 0; i < msg.count; i++) {
//         const rect = figma.createRectangle()
//         rect.x = i * 150
//         rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }]
//         figma.currentPage.appendChild(rect)
//         nodes.push(rect)
//     }

//     figma.currentPage.selection = nodes
//     figma.viewport.scrollAndZoomIntoView(nodes)

//     // This is how figma responds back to the ui
//     figma.ui.postMessage({
//         type: 'create-rectangles',
//         message: `Created ${msg.count} Rectangles`,
//     })
// }

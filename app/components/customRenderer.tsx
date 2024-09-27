import { useEffect, useMemo, useRef } from 'react'
import invariant from 'tiny-invariant'
import { usePageContext } from 'react-pdf'

import type { RenderParameters } from 'pdfjs-dist/types/src/display/api.js'

export default function CustomRenderer() {
  const pageContext = usePageContext()

  invariant(pageContext, 'Unable to find Page context.')

  const { _className, page, rotate, scale } = pageContext

  invariant(page, 'Attempted to render page canvas, but no page was specified.')

  const imageElement = useRef<HTMLImageElement>(null)

  const viewport = useMemo(() => page.getViewport({ scale, rotation: rotate }), [page, rotate, scale])

  function drawPageOnImage() {
    if (!page) {
      return
    }

    const { current: image } = imageElement

    if (!image) {
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderContext: RenderParameters = {
      canvasContext: canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D,
      viewport
    }

    const cancellable = page.render(renderContext)
    const runningTask = cancellable

    cancellable.promise
      .then(() => {
        image.src = canvas.toDataURL()
      })
      .catch(() => {
        // Intentionally empty
      })

    return () => {
      runningTask.cancel()
    }
  }

  useEffect(drawPageOnImage, [imageElement, page, viewport])

  return (
    <img
      className={`${_className}__image`}
      ref={imageElement}
      // height={viewport.height}
      // width={viewport.width}
      style={{
        // width: '100%',
        objectFit: 'contain',
        transitionProperty: 'transform',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'rotate(1080deg)'
      }}
    />
  )
}

import { BaseBoxShapeUtil, TLBaseShape, RecordProps, T, HTMLContainer } from '@tldraw/tldraw'
import { Radio } from 'lucide-react'

export type EventBusShape = TLBaseShape<
  'event-bus',
  {
    w: number
    h: number
    color: string
    size: 's' | 'm' | 'l' | 'xl'
    fill: 'none' | 'semi' | 'solid'
    dash: 'draw' | 'dashed' | 'dotted'
    text: string
  }
>

export class EventBusShapeUtil extends BaseBoxShapeUtil<EventBusShape> {
  static override type = 'event-bus' as const

  static override props: RecordProps<EventBusShape> = {
    w: T.number,
    h: T.number,
    color: T.string,
    size: T.literalEnum('s', 'm', 'l', 'xl'),
    fill: T.literalEnum('none', 'semi', 'solid'),
    dash: T.literalEnum('draw', 'dashed', 'dotted'),
    text: T.string,
  }

  override getDefaultProps(): EventBusShape['props'] {
    return {
      w: 140,
      h: 80,
      color: 'black',
      size: 'm',
      fill: 'none',
      dash: 'draw',
      text: '',
    }
  }

  override component(shape: EventBusShape) {
    const { w, h } = shape.props
    const iconSize = Math.min(w, h) * 0.7
    
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: w,
          height: h,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'currentColor',
        }}
      >
        <Radio 
          size={iconSize} 
          strokeWidth={this.getStrokeWidth(shape.props.size)}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        
        {shape.props.text && (
          <div
            style={{
              position: 'absolute',
              bottom: -h * 0.01,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: Math.min(w, h) * 0.12,
              color: 'currentColor',
              pointerEvents: 'none',
              userSelect: 'none',
              textAlign: 'center',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: w * 0.9,
            }}
          >
            {shape.props.text}
          </div>
        )}
      </HTMLContainer>
    )
  }

  override indicator(shape: EventBusShape) {
    const { w, h } = shape.props
    // Parallelogram indicator - skewed rectangle
    const skew = w * 0.15
    return (
      <path
        d={`M ${skew} 0 L ${w} 0 L ${w - skew} ${h} L 0 ${h} Z`}
      />
    )
  }

  private getStrokeWidth(size: 's' | 'm' | 'l' | 'xl'): number {
    switch (size) {
      case 's': return 1
      case 'm': return 2
      case 'l': return 3
      case 'xl': return 4
      default: return 2
    }
  }
}

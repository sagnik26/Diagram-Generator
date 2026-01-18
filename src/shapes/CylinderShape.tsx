import { BaseBoxShapeUtil, TLBaseShape, RecordProps, T, HTMLContainer } from '@tldraw/tldraw'
import { Database } from 'lucide-react'

// Define the cylinder shape type
export type CylinderShape = TLBaseShape<
  'cylinder',
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

// Custom ShapeUtil for cylinder - extends BaseBoxShapeUtil for automatic geometry handling
export class CylinderShapeUtil extends BaseBoxShapeUtil<CylinderShape> {
  static override type = 'cylinder' as const

  static override props: RecordProps<CylinderShape> = {
    w: T.number,
    h: T.number,
    color: T.string,
    size: T.literalEnum('s', 'm', 'l', 'xl'),
    fill: T.literalEnum('none', 'semi', 'solid'),
    dash: T.literalEnum('draw', 'dashed', 'dotted'),
    text: T.string,
  }

  override getDefaultProps(): CylinderShape['props'] {
    return {
      w: 120,
      h: 80,
      color: 'black',
      size: 'm',
      fill: 'none',
      dash: 'draw',
      text: '',
    }
  }

  override component(shape: CylinderShape) {
    const { w, h } = shape.props
    const iconSize = Math.min(w, h) * 0.7 // Scale icon to 70% of smallest dimension
    
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
        {/* Lucide Database Icon */}
        <Database 
          size={iconSize} 
          strokeWidth={this.getStrokeWidth(shape.props.size)}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        
        {/* Text overlay */}
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

  override indicator(shape: CylinderShape) {
    const { w, h } = shape.props
    const ellipseRadius = Math.min(w, h) * 0.15
    
    return (
      <path
        d={`
          M ${w / 2} ${ellipseRadius}
          A ${w / 2} ${ellipseRadius} 0 0 1 ${w} ${ellipseRadius}
          L ${w} ${h - ellipseRadius}
          A ${w / 2} ${ellipseRadius} 0 0 1 ${w / 2} ${h - ellipseRadius}
          A ${w / 2} ${ellipseRadius} 0 0 1 0 ${h - ellipseRadius}
          L 0 ${ellipseRadius}
          A ${w / 2} ${ellipseRadius} 0 0 1 ${w / 2} ${ellipseRadius}
          Z
        `}
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

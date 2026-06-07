export type LayerKey = 'air' | 'temp' | 'uv' | 'rain' | 'risk'

export const LAYER_LABELS: Record<LayerKey, string> = {
  air: '대기질',
  temp: '기온/체감',
  uv: '자외선',
  rain: '강수',
  risk: '복합 위험도',
}

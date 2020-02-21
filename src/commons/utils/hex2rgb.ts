export default function hex2rgb(hex: string, a?: number) {
  let color: any = { a: a || 1 }
  color.r = parseInt(`0x${hex.substring(1, 3)}`)
  color.g = parseInt(`0x${hex.substring(3, 5)}`)
  color.b = parseInt(`0x${hex.substring(5)}`)
  return color
}
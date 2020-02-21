
import { G2 } from "bizcharts";

const { Global } = G2

const COLORS = ['#3CC8B4', '#0099FF', '#74D13D', '#FFCC2A', '#FF6D67', '#9667E6', '#4C64C8', '#4B5278'];
const COLORS_16 =  ['#3CC8B4', '#B9EDE0', '#0099FF', '#7AD7FF', '#74D13D', '#B7EB8F', '#FFCC2A', '#FFE97A', '#FF6D67', '#FFBFB8', '#9667E6', '#DEC4FF', '#4C64C8', '#9DAFE0', '#4B5278', '#95979E']

const theme = {
  defaultColor: '#3CC8B4',
  colors: COLORS,
  colors_16: COLORS_16,
  // colors_24: [],
  colors_pie: COLORS,
  colors_pie_16: COLORS_16,
}

export default theme

Global.registerTheme('tezign', theme); 

Global.setTheme('tezign')

// Global.setTheme('dark'); 
#icon
## Props

name:Number   the name of icon

size:Number   the size of icon

color:String  the color of icon of icon

## Iusage

copy the svg to the folder  'src/assets/icons'

`<icon name='[svgFileName]' color='red' size='24'/>`

## Advanced usage
Overlay style
`/deep/ .svg-icon {
   background-color: red;
 }`
 
 or
 
 `<icon name='[svgFileName]' class="class-test" color='red' size='24'/>
 .class-test{
 background-color: red;
 }
 `

const options = [
  '#073b4c',
  '#005f73',
  '#94d2bd',
  '#0a9396',
  '#e9d8a6',
  '#ee9b00',
  '#ca6702',
  '#bb3e03',
  '#ae2012',
  '#9b2226',
  '#344e41',
  '#3a5a40',
  '#588157',
  '#a3b18a',
  '#dad7cd',
  '#cac5b8',
  '#98948a',
  '#65635c',
  '#33312e',
  '#000000',
]

const getStyle = (color: string) => `bg-[${color}]`

export default function ColorField() {
  return (
    <fieldset>
      <legend>색상</legend>
      <select name="color">
        {options.map((color) => (
          <option key={color} value={color}>
            {color}
            <div className={getStyle(color)} />
          </option>
        ))}
      </select>
    </fieldset>
  )
}

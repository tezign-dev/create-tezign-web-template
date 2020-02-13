export default function validFields(fields: any[]) {
  const invalid = fields.some((field: any) => {
    // 如果有错误或者正在校验中，返回
    return field.error || field.validating      
  })    
  if (invalid) return Promise.reject()
  //全量校验，都通过校验后提交数据
  const fc = fields.filter(field => !field.hidden).map(field => field.valid())
  return Promise.all(fc).then(() => {
    let data = {}
    fields.forEach((field: any) => {
      data[field.key] = field.value
    })
    return data
  })
}
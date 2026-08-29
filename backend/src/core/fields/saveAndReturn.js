export const saveAndReturnButton = './src/components/payload/SaveAndReturn/index.jsx#SaveAndReturnButton'

export function attachSaveAndReturn(entity) {
  if (!entity?.admin) return entity
  entity.admin.components = entity.admin.components || {}
  entity.admin.components.edit = {
    ...entity.admin.components.edit,
    SaveButton: saveAndReturnButton,
  }
  return entity
}

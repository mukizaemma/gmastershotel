export const rowActionsField = {
  name: 'rowActions',
  type: 'ui',
  label: 'Actions',
  admin: {
    disableGroupBy: true,
    components: {
      Field: './src/components/payload/ListCells/index.jsx#HiddenField',
      Cell: './src/components/payload/ListCells/index.jsx#RowActionsCell',
    },
  },
}

export function withRowActions(columns = []) {
  return columns.includes('rowActions') ? columns : [...columns, 'rowActions']
}

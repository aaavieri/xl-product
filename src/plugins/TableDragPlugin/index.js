let tableDrag = {
  bindDrag (elements, tableData, rowIdKey = 'id', callFuncs = {getRowIdFunc: defaultGetRowIdFunc}) {
    return new TableDragHandler(elements, tableData, callFuncs, rowIdKey)
  }
}

function defaultGetRowIdFunc (element) {
  let classNameArr = element.className.split(' ')
  let dragClassName = classNameArr.find(className => className.startsWith('drag-'))
  if (!dragClassName) {
    return null
  }
  let [, rowId] = dragClassName.split('-')
  return parseInt(rowId)
}

function TableDragHandler (elements, tableData, callFuncs, rowIdKey) {
  this.tableData = tableData
  this.elements = elements
  this.callFuncs = callFuncs
  this.draggingRow = null
  let tableDragHandler = this
  this.getRowByElement = (element, index) => {
    let rowId = callFuncs.getRowIdFunc(element, index)
    let rowData = tableData.find(row => row[rowIdKey] === rowId)
    return {rowId, rowData}
  }
  elements.map((element, index) => {
    element.draggable = true

    element.onselectstart = () => false
    element.ondragstart = (ev) => {
      if (tableDragHandler.draggingRow) {
        return false
      }
      let {rowData} = tableDragHandler.getRowByElement(element, index)
      ev.dataTransfer.effectAllowed = 'move'
      // console.log(`start row:${rowId}`)
      ev.dataTransfer.setData('text', ev.target.innerHTML)
      ev.dataTransfer.setDragImage(ev.target, 0, 0)
      tableDragHandler.draggingRow = rowData
      if (tableDragHandler.callFuncs.onDragStart) {
        tableDragHandler.callFuncs.onDragStart(ev, rowData)
      }
      return true
    }
    element.ondragover = (ev) => {
      ev.preventDefault()
      if (tableDragHandler.callFuncs.onDragOver) {
        let {rowData} = tableDragHandler.getRowByElement(element, index)
        tableDragHandler.callFuncs.onDragOver(ev, rowData, tableDragHandler.draggingRow)
      }
      return true
    }
    element.ondragend = (ev) => {
      let draggingRow = tableDragHandler.draggingRow
      if (tableDragHandler.draggingRow) {
        tableDragHandler.draggingRow = null
      }
      if (tableDragHandler.onDragEnd) {
        let {rowData} = tableDragHandler.getRowByElement(element, index)
        tableDragHandler.onDragEnd(ev, rowData, draggingRow ? draggingRow.rowData : null)
      }
      return true
    }
    element.ondragenter = () => true
    element.ondrop = (ev) => {
      let draggingRow = tableDragHandler.draggingRow
      if (!draggingRow) {
        return false
      }
      let {rowData} = tableDragHandler.getRowByElement(element, index)
      tableDragHandler.acceptDrop(rowData)
      if (tableDragHandler.callFuncs.onDrop) {
        tableDragHandler.callFuncs.onDrop(ev, rowData, draggingRow)
      }
      return false
    }
  })
  // this.rowDragHandlers = elements.map((element, index) => {
  //   element.draggable = true
  //   let rowId = callFuncs.getRowIdFunc(element, index)
  //   let rowData = tableData.find(row => row[rowIdKey] === rowId)
  //   let rowDragHandler = new RowDragHandler(rowId, rowData, tableDragHandler)
  //   rowDragHandler.bindElement(element)
  //   return rowDragHandler
  // })
  this.acceptDrop = (dropRow) => {
    let draggingRow = tableDragHandler.draggingRow
    let dropRowIndex = tableData.indexOf(tableData.find(row => row[rowIdKey] === dropRow[rowIdKey]))
    let draggingRowIndex = tableData.indexOf(tableData.find(row => row[rowIdKey] === draggingRow[rowIdKey]))
    // console.log(`drag row:${tableDragHandler.draggingRow[rowIdKey]}`)
    // console.log(`drop row:${dropRow[rowIdKey]}`)
    if (dropRowIndex < draggingRowIndex) {
      tableDragHandler.tableData.splice(draggingRowIndex, 1)
      tableDragHandler.tableData.splice(dropRowIndex, 0, draggingRow)
    } else if (dropRowIndex > draggingRowIndex) {
      tableDragHandler.tableData.splice(dropRowIndex + 1, 0, draggingRow)
      tableDragHandler.tableData.splice(draggingRowIndex, 1)
    }
    tableDragHandler.draggingRow = null
  }
  return this
}
// function RowDragHandler (rowId, rowData, tableDragHandler) {
//   let rowDragHandler = this
//   this.rowId = rowId
//   this.rowData = rowData
//   this.onSelectStart = () => false
//   this.onDragStart = (ev) => {
//     if (tableDragHandler.draggingRow) {
//       return false
//     }
//     ev.dataTransfer.effectAllowed = 'move'
//     console.log(`start row:${rowDragHandler.rowId}`)
//     ev.dataTransfer.setData('text', ev.target.innerHTML)
//     ev.dataTransfer.setDragImage(ev.target, 0, 0)
//     tableDragHandler.draggingRow = rowDragHandler
//     if (tableDragHandler.callFuncs.onDragStart) {
//       tableDragHandler.callFuncs.onDragStart(ev, rowDragHandler.rowData)
//     }
//     return true
//   }
//   this.onDragOver = (ev) => {
//     ev.preventDefault()
//     if (tableDragHandler.callFuncs.onDragOver) {
//       tableDragHandler.callFuncs.onDragOver(ev, rowDragHandler.rowData, tableDragHandler.draggingRow.rowData)
//     }
//     return true
//   }
//   this.onDragEnd = (ev) => {
//     let draggingRow = tableDragHandler.callFuncs.draggingRow
//     if (tableDragHandler.callFuncs.draggingRow) {
//       tableDragHandler.callFuncs.draggingRow = null
//     }
//     if (tableDragHandler.onDragEnd) {
//       tableDragHandler.onDragEnd(ev, rowDragHandler.rowData, draggingRow ? draggingRow.rowData : null)
//     }
//     return true
//   }
//   this.onDragEnter = () => true
//   this.onDrop = (ev) => {
//     let draggingRow = tableDragHandler.draggingRow
//     if (!draggingRow) {
//       return false
//     }
//     tableDragHandler.acceptDrop(rowDragHandler)
//     if (tableDragHandler.callFuncs.onDrop) {
//       tableDragHandler.callFuncs.onDrop(ev, rowDragHandler.rowData, draggingRow.rowData)
//     }
//     return false
//   }
//   this.bindElement = (element) => {
//     element.onselectstart = rowDragHandler.onSelectStart
//     element.ondragstart = rowDragHandler.onDragStart
//     element.ondragend = rowDragHandler.onDragEnd
//     element.ondragover = rowDragHandler.onDragOver
//     element.ondragenter = rowDragHandler.onDragEnter
//     element.ondrop = rowDragHandler.onDrop
//   }
// }
const DragPlugin = {
  install (Vue) {
    tableDrag.$vue = Vue
    Vue.mixin({
      data () {
        return {
          tableDrag
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$tableDrag', {
      get () {
        return this.$root.tableDrag
      }
    })
  }
}

export default DragPlugin

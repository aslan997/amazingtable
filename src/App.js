import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const initialColumns = [
  { id: 'col1', name: 'Name' },
  { id: 'col2', name: 'Address' },
  { id: 'col3', name: 'Age' },
  { id: 'col4', name: 'Gender' },
  { id: 'col5', name: 'Category' },
];

const generateRandomData = (column) => {
  const data = [];
  for (let i = 0; i < 5; i++) {
    if (column === 'Name') {
      data.push(`Name ${i + 1}`);
    } else if (column === 'Address') {
      data.push(`Address ${i + 1}`);
    } else if (column === 'Age') {
      data.push(Math.floor(Math.random() * 100));
    } else if (column === 'Gender') {
      data.push(i % 2 === 0 ? 'Male' : 'Female');
    } else if (column === 'Category') {
      data.push(`Category ${i + 1}`);
    }
  }
  return data;
};

const Table = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [data, setData] = useState([]);
  for (let i = 0; i < 5; i++) {
    data.push({
      id: `row${i + 1}`,  // Use string IDs like "row1", "row2", etc.
      ...generateRandomData('Name'),
    });
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    if (result.type === 'COLUMN') {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(result.source.index, 1);
      newColumns.splice(result.destination.index, 0, removed);
      setColumns(newColumns);
    }

    if (result.type === 'ROW') {
      const newData = [...data];
      const [moved] = newData.splice(result.source.index, 1);
      newData.splice(result.destination.index, 0, moved);
      setData(newData);
    }
  };

  const addColumn = () => {
    const newColumn = prompt('Enter column name');
    if (newColumn) {
      setColumns([...columns, { id: `col${columns.length + 1}`, name: newColumn }]);
    }
  };

  return (
    <div className="table-container">
      <button onClick={addColumn}>Add Column</button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" type="COLUMN" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="table"
            >
              {columns.map((col, columnIndex) => (
                <Draggable key={col.id} draggableId={col.id} index={columnIndex} type="COLUMN">
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="column"
                    >
                      <div className="column-header">
                        <ResizableBox
                          width={200}
                          height={30}
                          minConstraints={[100, Infinity]}
                          maxConstraints={[400, Infinity]}
                          axis="x"
                          handle={<span className="resize-handle" />}
                        >
                          {col.name}
                        </ResizableBox>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="rows" type="ROW">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="table"
            >
              {data.map((row, rowIndex) => (
                <Draggable key={row.id} draggableId={`${row.id}_${rowIndex}`} index={rowIndex} type="ROW">
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="row"
                    >
                      {columns.map((col) => (
                        <ResizableBox
                          key={col.id}
                          width={200}
                          height={30}
                          minConstraints={[100, Infinity]}
                          maxConstraints={[400, Infinity]}
                          axis="x"
                          handle={<span className="resize-handle" />}
                        >
                          {row[col.name]}
                        </ResizableBox>
                      ))}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Table;

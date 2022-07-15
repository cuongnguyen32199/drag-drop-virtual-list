import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { AutoSizer, ColumnSizer, Grid } from 'react-virtualized';
import styled from 'styled-components';

import './main.css';
import Column from './column';
import Header from './header';
import Sidebar from './sidebar';

import initialData from './initial-data';

const Container = styled.div``;

function App() {
  const [state, setState] = useState(initialData);
  const [documentHeight, setDocumentHeight] = useState(document.documentElement.clientHeight);

  const onResize = () => {
    setDocumentHeight(document.documentElement.clientHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      };

      setState(newState);
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };

      setState(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setState(newState);
  };

  const columnCount = state.columnOrder.length;

  const cellRenderer = ({ columnIndex, style }) => {
    const columnId = state.columnOrder[columnIndex];

    const column = state.columns[columnId];
    const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

    const patchedStyle = {
      ...style,
      width: `calc(${style.width} - 16px)`,
    };

    return (
      <div style={patchedStyle} key={column.id}>
        <Column column={column} tasks={tasks} index={columnIndex} style={style} />
      </div>
    );
  };

  return (
    <div className="main-container">
      <div className="head">
        <Header />
      </div>
      <div className="left">
        <Sidebar />
      </div>
      <div className="right">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                <AutoSizer>
                  {({ width }) => (
                    <ColumnSizer columnMaxWidth={298} columnMinWidth={298} columnCount={columnCount} key="GridColumnSizer" width={width}>
                      {({ adjustedWidth, columnWidth, registerChild }) => <Grid ref={registerChild} columnWidth={columnWidth} columnCount={columnCount} height={documentHeight - 51} cellRenderer={cellRenderer} rowHeight={documentHeight - 64} rowCount={1} width={adjustedWidth} innerRef={provided.innerRef} />}
                    </ColumnSizer>
                  )}
                </AutoSizer>
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;

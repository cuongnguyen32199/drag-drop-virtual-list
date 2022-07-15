import React from 'react';
import styled from 'styled-components';

import { ucFirst, getStyle } from './utils';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : 'white')};
  display: grid;
  grid-template-columns: 65px 1fr;
  align-items: center;
  word-break: break-all;
  margin-bottom: 8px;
`;

function Task({ provided, isDragging, task, style }) {
  return (
    <Container {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} isDragging={isDragging} style={getStyle(provided, style)}>
      <span className="text-bold">{ucFirst(task.id)}</span>
      <span className="text-name">{task.content}</span>
    </Container>
  );
}

export default Task;

import React, { Component } from "react";
import { Droppable } from 'react-beautiful-dnd';

export default class DraggableCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //   console.log('this.props.card', this.props.card);
    return (
      <Droppable droppableId={this.props.card.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={{
                backgroundColor: snapshot.isDraggingOver ? "blue" : "white",
                width: 200,
                height: 400,
                margin: 10,
                border: '1px dashed orange',
                display: 'inline-flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: 10
            }}
            {...provided.droppableProps}
          >
            {this.props.card.letter}
            { this.props.card.isVisible && <img src={this.props.card.img} className="image" /> }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}

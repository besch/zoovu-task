import React, { Component } from 'react';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';
import DraggableCards from './DraggableCards';
import DropableArea from './DropableArea';
const questionImg = require('./img/question.png');

const shuffle = array => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const getItems = () => {
  const zoovuArray = Array.from('zoovu');
  const shuffled = shuffle([...zoovuArray]);

  return {
    draggable: shuffled.map((l, i) => ({
      id: `draggable-${i}`,
      img: questionImg,
      letter: l,
      index: 1
    })),
    droppable: zoovuArray.map((l, i) => ({
      id: `droppable-${i}`,
      img: require(`./img/${l}.png`),
      letter: l,
      isVisible: false
    }))
  };
};

const getRandomElFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export default class App extends Component {
  timerInterval;

  constructor(props) {
    super(props);

    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.populateNewState = this.populateNewState.bind(this);

    this.state = this.populateNewState();
  }

  populateNewState() {
    const items = getItems();
    const randomItem = getRandomElFromArray(items.draggable);
    return {
      ...items, 
      counter: 0, 
      randomItem };
  }

  onDragStart() {
    if (this.state.counter === 0) {
      this.timerInterval = setInterval(() => {
        this.setState({
          counter: ++this.state.counter
        });
      }, 1000);
    }
  }

  onDragEnd(result) {
    if (!result.destination || result.source.droppableId === result.destination.droppableId) {
      return;
    }

    const destinationElIndex = Number(result.destination.droppableId.split('-')[1]);
    const destinationEl = this.state.droppable[destinationElIndex];

    if (this.state.draggable[result.source.index].letter === destinationEl.letter && this.state.randomItem.letter === destinationEl.letter) {
      const stateDraggable = [...this.state.draggable];
      const stateDroppable = [...this.state.droppable];

      stateDraggable.splice(result.source.index, 1);
      stateDroppable.splice(destinationElIndex, 1, { 
          ...destinationEl,
          isVisible: true
      });

      this.setState({
        draggable: stateDraggable,
        droppable: stateDroppable,
        randomItem: stateDraggable.length && getRandomElFromArray(stateDraggable)
      }, () => {
        if (this.state.draggable.length === 0) {
          clearInterval(this.timerInterval);
          setTimeout(() => {
            this.setState({...this.populateNewState()});
          }, 10000);
        }
      });
    } else {
      this.setState({
        counter: this.state.counter += 10,
        randomItem: this.state.draggable && getRandomElFromArray(this.state.draggable)
      });
    }
  }

  render() {
    return (
      <>
        <div style={{width: '75%', display: 'inline-block', marginRight: 20}}>
          <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
            <h3>Pickup Card</h3>
            <DraggableCards items={this.state.draggable} />
      
            <hr />
      
            <h3>Zoovu Logo</h3>
            {
              this.state.droppable.map((v, i) => <DropableArea key={i} card={v} />)
            }
          </DragDropContext>
        </div>

        <div style={{width: '20%', display: 'inline-block', verticalAlign: 'top'}}>
          Score: {this.state.counter}
          <hr />
          Find this card
          <img src={this.state.randomItem.letter && require(`./img/${this.state.randomItem.letter}.png`)} />
        </div>
      </>
    );
  }
}
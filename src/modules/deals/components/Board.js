import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Wrapper } from 'modules/layout/components';
import { EmptyState } from 'modules/common/components';
import { DragDropContext } from 'react-beautiful-dnd';

import { Pipeline } from '../containers';
import { BarItems } from 'modules/layout/styles';
import { Button, DropdownToggle, Icon } from 'modules/common/components';

const propTypes = {
  currentBoard: PropTypes.object,
  boards: PropTypes.array,
  pipelines: PropTypes.array,
  onDragEnd: PropTypes.func,
  states: PropTypes.object
};

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.renderBoard = this.renderBoard.bind(this);
    this.renderPipeline = this.renderPipeline.bind(this);
  }

  renderBoard() {
    const { currentBoard, boards } = this.props;

    if (boards.length === 1) {
      const { __ } = this.context;

      return (
        <li>
          <Link to="/settings/deals">
            <Icon icon="plus" /> {__('Create another board')}
          </Link>
        </li>
      );
    }

    return boards.map(board => {
      if (board._id !== currentBoard._id) {
        return (
          <li key={board._id}>
            <Link to={`/deals/board?id=${board._id}`}>{board.name}</Link>
          </li>
        );
      }

      return null;
    });
  }

  renderPipeline() {
    const { states, pipelines, currentBoard } = this.props;

    const stageStates = {};

    Object.keys(states).forEach(key => {
      if (key.startsWith('stageState')) {
        stageStates[key] = states[key];
      }
    });

    if (pipelines.length === 0) {
      return (
        <EmptyState
          linkUrl={`/settings/deals?boardId=${currentBoard._id}`}
          linkText="Create one"
          size="full"
          text="There is no pipeline in this board."
          image="/images/robots/robot-05.svg"
        />
      );
    }

    return pipelines.map(pipeline => (
      <Pipeline
        key={pipeline._id}
        {...stageStates}
        state={states[`pipelineState${pipeline._id}`]}
        pipeline={pipeline}
      />
    ));
  }

  render() {
    const { __ } = this.context;
    const breadcrumb = [{ title: __('Deal') }];

    const { currentBoard, onDragEnd } = this.props;

    if (!currentBoard) {
      return (
        <Wrapper
          header={<Wrapper.Header breadcrumb={breadcrumb} />}
          content={
            <EmptyState
              linkUrl="/settings/deals"
              linkText="Create one"
              size="full"
              text="There is no board."
              image="/images/robots/robot-05.svg"
            />
          }
          transparent
        />
      );
    }

    const actionBarLeft = (
      <BarItems>
        <Dropdown id="dropdown-board">
          <DropdownToggle bsRole="toggle">
            <Button btnStyle="simple" size="small">
              {currentBoard.name} <Icon icon="ios-arrow-down" />
            </Button>
          </DropdownToggle>

          <Dropdown.Menu>{this.renderBoard()}</Dropdown.Menu>
        </Dropdown>
      </BarItems>
    );

    const actionBar = (
      <Wrapper.ActionBar left={actionBarLeft} background="transparent" />
    );

    const content = (
      <DragDropContext onDragEnd={onDragEnd}>
        {this.renderPipeline()}
      </DragDropContext>
    );

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        actionBar={actionBar}
        content={content}
        transparent
      />
    );
  }
}

Board.propTypes = propTypes;
Board.contextTypes = {
  __: PropTypes.func
};

export default Board;

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Box from 'grommet/components/Box'
import Button from 'grommet/components/Button'
import Heading from 'grommet/components/Heading'
import Split from 'grommet/components/Split'
import RefreshIcon from 'grommet/components/icons/base/Refresh'
import Close from 'grommet/components/icons/base/Close'
import TrashIcon from 'grommet/components/icons/base/Trash' //eslint-disable-line
import Meter from 'grommet/components/Meter'
import Value from 'grommet/components/Value'
import { Hovercard } from '../myflashcards/main'
import TestCard from './testcard'
import { TestWordsLens, TotalWordsLens } from './lenses'
import styled from 'styled-components'
import IdentityComponent from '../../futils/identitycomponent'
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious'
import Animate from 'grommet/components/Animate'
import { FoldingCube } from 'better-react-spinkit'
import ComposeR from 'compose-r'
import EitherComponent from '../../futils/eithercomponent'

const SidebarActions = () => styled(Box)`
  font-size: 18px;
  background-color: #FDD835;
  transition: background-color 0.5s ease;
  color: #fff;
  &:hover{
    background-color: #FBC02D;
    & > div > div > button > span > svg {
      fill: #000;
      stroke: #000;
    }
  }
`

const WhiteHoverCard = styled(Hovercard)`
  &:hover {
    & > div{
      background-color: #fff;
    }
  }
`
const LineLink = styled.a`
  transition: background-color 0.5s ease;
  color: #FBC02D;
  display: inline-block;
  position: relative;
  text-decoration: none;
  cursor: pointer;
  padding: 5px 5px;
  &:before {
    background-color: #FBC02D;
    content: '';
    height: 2px;
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    transition: width 0.3s ease-in-out;
    width: 100%;
  }
  &:hover {
    background-color: #FDD835;
    color:#fff;
    &:before {
      width: 0;
    }
  }
`
const FlameSidebarAction = x => styled(x)`
  background-color: #FF576D;
  &:hover{
    background-color: #FF324D;
    & > div > div > button > span > svg {
      fill: #000;
      stroke: #000;
    }
  }
`

const LightGreyTestArea = styled(Box)`
  background-color: #ebeced;
`

const LimitedSplit = styled(Split)`
  & > div{
    height: inherit;
  }
`

const CreateGameStatSeries = (correctWords, incorrectWords, totalWords) => [{
  label: `Correct ${correctWords}`,
  value: correctWords,
  colorIndex: 'ok',
  onClick: () => null
},
  {
    label: `Incorrect ${incorrectWords}`,
    value: incorrectWords,
    colorIndex: 'critical',
    onClick: () => null
  },
  {
    label: `Remaining ${totalWords}`,
    value: totalWords,
    colorIndex: 'neutral-3-t',
    onClick: () => null
  }
]

export default class Test extends Component {

  componentDidMount () {
    this.props.initTestState()
  }

  render () {
    return (
      <LimitedSplit flex='right' priority='left' separator={false} showOnResponsive='both'>
        <IdentityComponent fn={styled(Box)`
          background-color: #E5E3DF;
        `}
          colorIndex='neutral-4'
          size='medium'
          justify='between'
          full
        >
          <EitherComponent conditionerFn={() => this.props.leftLoader}
            leftComponent={_ => <Box full align='center' alignContent='center' justify='center'>
              <FoldingCube size={100} color='#1B998B' />
            </Box>}
            rightComponent={_ => null}
          />
          <EitherComponent conditionerFn={() => !this.props.ongoingTest && !this.props.leftLoader}
            leftComponent={_ => <IdentityComponent
              fn={SidebarActions()}
              colorIndex='grey-4'
              size='large'
              pad='medium'
              justify='center'
              align='center'
              onClick={() =>
                this.props.showModal({ header: 'SELECT A LIST FOR THE TEST', content: 'TEST_LIST_SELECT' })}>
              Create New Test
            </IdentityComponent>}
            rightComponent={_ => null} />
          <EitherComponent conditionerFn={() => !this.props.ongoingTest}
            leftComponent={_ => <Box pad='medium'>
              {
                this.props.savedTests.map((test, index) =>
                  <WhiteHoverCard key={index}
                    colorIndex='light-1' onClick={() => this.props.getTest({ index, listId: test.listId })}
                    align='center'>
                    <Heading>{test.listName} <Button icon={<Close size='medium' />}
                      onClick={() => this.props.delete({ index, listId: test.listId })} /></Heading>
                    <Meter series={CreateGameStatSeries(test.correctWords, test.incorrectWords, test.wordsToPlay)}
                      type='spiral' />
                  </WhiteHoverCard>
                )
              }
            </Box>}
            rightComponent={_ => null}
          />
          <EitherComponent conditionerFn={() => this.props.ongoingTest}
            leftComponent={_ => <IdentityComponent
              fn={SidebarActions()}
              colorIndex='grey-4'
              size='large'
              pad='small'
              justify='center'
              align='center'
              onClick={() => this.props.goBack()}>
              <Animate enter={{ animation: 'slide-left', duration: 1000, delay: 0 }}
                keep>
                <Button icon={<LinkPrevious size='medium' colorIndex='light-1' />} />
              </Animate>
            </IdentityComponent>}
            rightComponent={_ => null} />
          <EitherComponent conditionerFn={() => this.props.ongoingTest}
            leftComponent={_ => <Heading align='center'>{this.props.listName}</Heading>}
            rightComponent={_ => null}
          />
          <EitherComponent conditionerFn={() => this.props.ongoingTest}
            leftComponent={
                _ =>
                  <Box justify='center' pad={{ horizontal: 'large', vertical: 'medium' }}
                    alignContent='center'>
                    <Value value={TestWordsLens(this.props, 'correctWords')}
                      units='words' label='Correct' />
                    <Meter colorIndex='ok' value={TestWordsLens(this.props, 'correctWords')} onActive={() => null}
                      max={TotalWordsLens(this.props)} />
                    <Value value={TestWordsLens(this.props, 'incorrectWords')}
                      units='words' label='Incorrect' />
                    <Meter colorIndex='critical' value={TestWordsLens(this.props, 'incorrectWords')}
                      onActive={() => null}
                      max={TotalWordsLens(this.props)} />
                    <Value value={TestWordsLens(this.props, 'wordsToPlay')}
                      units='words' label='Remaining' />
                    <Meter value={TestWordsLens(this.props, 'wordsToPlay')} onActive={() => null}
                      max={TotalWordsLens(this.props)} />
                  </Box>}
            rightComponent={_ => null}
          />
          <Box alignSelf='center'>
            <EitherComponent conditionerFn={() => this.props.ongoingTest}
              leftComponent={_ => <IdentityComponent
                fn={ComposeR(SidebarActions, FlameSidebarAction)()}
                colorIndex='grey-4'
                size='large'
                pad='small'
                justify='center'
                align='center'
                alignSelf='end'
                onClick={() => this.props.reset(this.props.listId)}>
                <Animate enter={{ animation: 'slide-left', duration: 1000, delay: 0 }}
                  keep>
                  <Button icon={<RefreshIcon size='large' colorIndex='light-1' />} />
                </Animate>
              </IdentityComponent>}
              rightComponent={_ => null}
            />
          </Box>
        </IdentityComponent>
        <LightGreyTestArea full colorIndex='light-2' justify='center' direction='row' align='center'>
          <EitherComponent conditionerFn={() => !this.props.ongoingTest}
            leftComponent={_ =>
              <Heading>
                <LineLink onClick={() =>
                  this.props.showModal({ header: 'SELECT A LIST FOR THE TEST', content: 'TEST_LIST_SELECT' })}>
                  Create New Test
                </LineLink> or select from previous ones</Heading>}
            rightComponent={_ => null}
          />
          <EitherComponent conditionerFn={() => this.props.ongoingTest && !this.props.rightLoader}
            leftComponent={_ =>
              <TestCard word={this.props.testWordsArray[this.props.testWordsCounter] &&
              this.props.testWordsArray[this.props.testWordsCounter].word}
                meaning={this.props.testWordsArray[this.props.testWordsCounter] &&
                this.props.testWordsArray[this.props.testWordsCounter].meaning}
                example={this.props.testWordsArray[this.props.testWordsCounter] &&
                this.props.testWordsArray[this.props.testWordsCounter].example}
                hiddenCondition={!this.props.revealed && this.props.testWordsCounter <
                this.props.testWordsArray.length}
                revealedCondition={this.props.revealed &&
                this.props.testWordsCounter < this.props.testWordsArray.length}
                completedCondition={this.props.testWordsCounter === this.props.testWordsArray.length}
                revealFn={() => this.props.reveal()}
                onCorrect={() => this.props.setStatus({
                  status: 1, wordObj: this.props.testWordsArray[this.props.testWordsCounter]
                })}
                onIncorrect={() =>
                  this.props.setStatus({
                    status: -1, wordObj: this.props.testWordsArray[this.props.testWordsCounter]
                  })}
              />} rightComponent={_ => null} />
          { this.props.ongoingTest && this.props.rightLoader && <FoldingCube size={100} color='#865cd6' /> }
        </LightGreyTestArea>
      </LimitedSplit>
    )
  }
}

Test.propTypes = {
  initTestState: PropTypes.func,
  savedTests: PropTypes.array,
  ongoingTest: PropTypes.bool,
  goBack: PropTypes.func,
  listName: PropTypes.string,
  getTest: PropTypes.func,
  showModal: PropTypes.func,
  revealed: PropTypes.bool,
  reveal: PropTypes.func,
  testWordsArray: PropTypes.array,
  testWordsCounter: PropTypes.number,
  setStatus: PropTypes.func,
  listId: PropTypes.string,
  reset: PropTypes.func,
  testIndex: PropTypes.number,
  delete: PropTypes.func,
  leftLoader: PropTypes.bool,
  rightLoader: PropTypes.bool
}

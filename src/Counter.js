import React, { Component } from 'react';
class Counter extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            count:0,
        }
    }
    componentWillReceiveProps(nextProps) {
        //父组件传入或更新props  此函数才会被调用
        console.log('componentWillReceiveProps')
        // this.setState({})
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log(nextState);
        nextState.count = 100;
        return true;
    }
    componentWillUpdate(nextProps, nextState) {
    // ...
    }
    componentDidUpdate(prevProps, prevState) {
    //
    }
    handleClick(e){
        e.preventDefault();
        this.setState({
            count: this.state.count + 1,
        });
    }
    render(){
        return(
            <div style={{margin:20+'px'}}>
                <p>{this.state.count}</p>
                <button onClick={this.handleClick}>更新</button>
            </div>
        );
    }
}
export default Counter;
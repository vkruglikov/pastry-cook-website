import React from 'react';

class Page extends React.Component {
    state = {
        hasError: false
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true});
    }

    render() {
        if (this.state.hasError) {
            return <h1>Упс.. Ошибка</h1>;
        }
        return this.props.children;
    }
}

export default Page;
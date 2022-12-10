import {Component} from 'react';

export class ErrorBoundary extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error: unknown) {
        return { hasError: true };
    }
  
    render() {
        if (this.state.hasError) {
            return <h1>Произошла ошибка. Перезагрузите страницу и попробуйте снова.</h1>;
        }

        return this.props.children; 
    }
}

// CustomText.js
import React from 'react';
import { StyleSheet, Text, Image } from 'react-native';

export default class YImageLoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageLoadFailed: true
        }

        fetch(this.props.yurl)
            .then(res => {
                if (res.status == 404) {
                    this.setState({
                        imageLoadFailed: true
                    });
                } else {
                    this.setState({
                        imageLoadFailed: false
                    });

                }
            })
            .catch(err => {
                this.setState({
                    imageLoadFailed: true
                });

            })



    }

    render() {
        return (
            this.state.imageLoadFailed ?
                <Image style={[styles.defaultStyle, this.props.style]}  source={this.props.placeholderSource}/>
                : <Image style={[styles.defaultStyle, this.props.style]}  source={{ uri: this.props.yurl }}/>

        );
    }
}

const styles = StyleSheet.create({
    defaultStyle: {
       
    }
});

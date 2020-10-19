import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import Video from 'react-native-video';
import database from '@react-native-firebase/database';
import { Container } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob'
const fs = RNFetchBlob.fs
const RNFS = require('react-native-fs');

export default class VideoPlayer extends Component {

    constructor(props) {
        super(props);
        // console.warn('props are :' + JSON.stringify(props))
        this.state = {
            userData: [],
            path: RNFS.DocumentDirectoryPath + '/video.mp4'
        };
    }

    componentDidMount() {
        database()
            .ref('/videos')
            .once('value')
            .then(snapshot => {
                this.setState({ userData: [...this.state.userData, snapshot.val()] })
                console.warn('Modified State')
                this.mountVideo(this.state.userData)
            }).catch(e => {
                console.warn('error querying data: ' + e)
            })
    }
    
    
    mountVideo(data){
        // console.log(data[0].video3753.encodedData)
        // const decodedFile = base64.decode(data)
        // console.warn(decodedFile)
        //'video/mp4;base64' + 
        // const builtDecodedData = decodedFile.split(",")[1] + '.mp4'
        // this.setState({ encodedData : builtDecodedData})
        // console.log(data[0].video.encodedData)
        RNFS.writeFile(RNFS.DocumentDirectoryPath + '/video.mp4', data[0].video.encodedData, 'base64')
        .then(() => {
            console.warn('FILE WRITTEN!')
            console.warn(RNFS.DocumentDirectoryPath + '/video.mp4')
        })
        .catch((err) => {
            console.warn('failed writting file: '+err.message);
        });
    }
    // test video path https://www.w3schools.com/html/mov_bbb.mp4
    render() {
        return (
            <Container>
                {console.warn(RNFS.DocumentDirectoryPath + '/video.mp4' === (null || undefined))}
                <Video source={RNFS.DocumentDirectoryPath + '/video.mp4' ? {uri: RNFS.DocumentDirectoryPath + '/video.mp4'} : {uri : 'https://www.w3schools.com/html/mov_bbb.mp4'}}
                    ref={(ref) => {
                        this.player = ref
                    }}
                    fullscreen
                    controls
                    fullscreenAutorotate={true}
                    style={styles.backgroundVideo}
                    responsive={true}
                    resizeMode={'cover'}
                    />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1
    },
});
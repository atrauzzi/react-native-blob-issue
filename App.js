/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { RNCamera } from "react-native-camera";
import axios from "axios";


/**
 * https://pipedream.com/r/en6p84tk48p63
 * https://bit.ly/2TxiQTT
 */
export default class App extends Component {

  camera = null;

  state = {
    last: null,
  }

  render() {
    return <RNCamera
      style={styles.camera}
      ref={(camera) => this.camera = camera}
      quality={1}
    >

      <Text style={styles.welcome}>Blobs in React Native</Text>
      <Text style={styles.instructions}>See requests at: https://bit.ly/2TxiQTT</Text>

      <View style={styles.shutterContainer}>

        {
          this.state.last && <Text style={styles.last}>{this.state.last}</Text>
        }        

        <TouchableHighlight onPress={this.takePicture}>
          <Text style={styles.shutter}>🎭</Text>
        </TouchableHighlight>

      </View>

    </RNCamera>;
  }

  takePicture = () => {

    this.camera.takePictureAsync().then((data) => {

      this.setState({
        last: data.uri,
      });

      return fetch(data.uri)
        .then((response) => {

          return response.blob();
        })
        .then((blob) => {

          // const isBlob = blob instanceof Blob
          //   ? "Yes!"
          //   : "No.";

          // alert("Is it a blob? " + isBlob);

          this.uploadWholeBlobWithFetch(blob);
          this.uploadHalfOfBlobWithFetch(blob);
          this.uploadWholeBlobWithAxios(blob);
          this.uploadHalfOfBlobWithAxios(blob);
        });
    });
  };

  /**
   * Receives a Blob or blob-like object and sends it via the fetch API.
   */
  uploadWholeBlobWithFetch = (blob) => {

    fetch('https://en6p84tk48p63.x.pipedream.net', {
      method: 'post',  
      headers: {
        'rn-debug': "Upload whole blob with fetch."
      },
      body: blob,
    });
  };

  /**
   * Receives a blob or blob-like object, slices it in half-ish and sends it via the fetch API.
   */
  uploadHalfOfBlobWithFetch = (blob) => {

    const slicedBlob = blob.slice(0, Math.floor(blob.size / 2));

    fetch('https://en6p84tk48p63.x.pipedream.net', {
      method: 'post',
      headers: {
        'rn-debug': "Upload half of blob with fetch."
      },
      body: slicedBlob,
    });
  };

  /**
   * Receives a blob or blob-like object and sends it via axios (XHR).
   */
  uploadWholeBlobWithAxios = (blob) => {

    axios.post('https://en6p84tk48p63.x.pipedream.net', blob, {
      headers: {
        "content-type": "image/jpeg",
        'rn-debug': "Upload whole blob with axios."
      },
    });
  };

  /**
   * Receives a blob or blob-like object, slices it in half-ish and sends it via axios (XHR).
   */
  uploadHalfOfBlobWithAxios = (blob) => {

    const slicedBlob = blob.slice(0, Math.floor(blob.size / 2));

    axios.post('https://en6p84tk48p63.x.pipedream.net', slicedBlob, {
      headers: {
        "content-type": "application/octet-stream",
        'rn-debug': "Upload half of blob with axios."
      },
    });
  };
}

const styles = StyleSheet.create({
  camera: {
    flexGrow: 1,
    padding: 0,
    margin: 0,
    flexDirection: 'column',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    padding: 20,
    color: "#cecece",
    backgroundColor: "#333333A0",
  },
  instructions: {
    textAlign: 'center',
    backgroundColor: "#333333A0",
    color: '#336AA0',
    fontSize: 18,
    padding: 20,
  },
  shutterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  last: {
    marginBottom: 20,
    marginRight: 10,
    marginLeft: 10,
    padding: 30,
    backgroundColor: "#ffffffd0",
    borderRadius: 120,
  },
  shutter: {
    fontSize: 40,
    textAlign: 'center',
    backgroundColor: "#c0c0c0AA",
    width: 75,
    padding: 10,
    borderRadius: 120,
  },
});

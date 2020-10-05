import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Webcam from "react-webcam";

function get_prediction(base64, callback) {
  const message = {
    image: base64.replace("data:image/jpeg;base64", ""),
  };

  const params = {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(message),
    method: "POST",
  };

  fetch("http://192.168.0.17:5000/predict", params)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => console.log(error));
}

class WebcamWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webcamRef: {
        current: null,
      },
      show: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleScreenshot = this.handleScreenshot.bind(this);
  }

  handleClose() {
    this.setState({
      show: false,
    });
  }

  handleScreenshot() {
    const imgSrc = this.state.webcamRef.current.getScreenshot();
    const img = new Image();
    img.src = imgSrc;
    this.props.onScreenshot(img);
    this.handleClose();
  }

  handleShow() {
    this.setState({
      show: true,
    });
  }

  render() {
    return (
      <>
        <Button variant="dark" size="lg" onClick={this.handleShow}>
          Use Camera
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Body>
            <Webcam
              audio={false}
              mirrored={true}
              ref={this.state.webcamRef}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
              screenshotFormat="image/jpeg"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={this.handleScreenshot}>
              Screenshot
            </Button>
            <Button variant="warning" onClick={this.handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

class StorageRetriever extends React.Component {
  constructor(props) {
    super(props);
    this.onFileSelected = this.onFileSelected.bind(this);
  }

  onFileSelected(e) {
    if (e.target.files.length > 0) {
      let reader = new FileReader();
      const callback = this.props.onFileRetrieved;
      reader.onloadend = function () {
        const dataUrl = reader.result;
        const image = new Image();
        image.src = dataUrl;
        callback(image);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  render() {
    return (
      <label className="btn btn-dark btn-lg">
        Browse{" "}
        <input
          type="file"
          onChange={this.onFileSelected}
          accept="image/*"
          hidden
        />
      </label>
    );
  }
}

class InputRetriever extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastScrnshot: null,
      lastPrediction: null,
    };
    this.onInputRecieved = this.onInputRecieved.bind(this);
    this.make_prediction = this.make_prediction.bind(this);
    this.updatePrediction = this.updatePrediction.bind(this);
  }

  make_prediction() {
    get_prediction(this.state.lastScrnshot.src, this.updatePrediction);
  }

  onInputRecieved(scrnshot) {
    this.setState({
      lastScrnshot: scrnshot,
    });
  }

  computePreviewStyling() {
    if (this.state.lastScrnshot === null) {
      return "img img-fluid";
    }

    return "img img-fluid rounded border border-dark";
  }

  updatePrediction(data) {
    this.setState({
      lastPrediction: data.prediction,
    });
  }

  render() {
    let prediction = <div></div>;
    if (this.state.lastPrediction != null) {
      prediction = (
        <div className="py-2 font-weight-bolder display-4 text-center">
          <span className="text-success">
            Benign: {this.state.lastPrediction.benign.toFixed(3)}
          </span>
          <br />
          <span className="text-danger">
            Malignant: {this.state.lastPrediction.malignant.toFixed(3)}
          </span>
        </div>
      );
    }

    return (
      <Container className="py-3">
        <Row className="justify-content-center">
          <Col xs="auto">
            <WebcamWrapper onScreenshot={this.onInputRecieved} />
          </Col>
          <Col xs="auto">
            <StorageRetriever onFileRetrieved={this.onInputRecieved} />
          </Col>
        </Row>
        <Row className="justify-content-center py-2">
          <img
            className={this.computePreviewStyling()}
            src={
              this.state.lastScrnshot == null
                ? null
                : this.state.lastScrnshot.src
            }
          />
        </Row>
        <Row className="justify-content-center py-3">
          <Button
            variant="dark"
            size="lg"
            onClick={
              this.state.lastScrnshot == null ? null : this.make_prediction
            }
          >
            Predict
          </Button>
        </Row>
        <Row className="justify-content-center py-3">{prediction}</Row>
      </Container>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Container className="py-3">
        <div className="display-1 text-center pb-5">Tumour Analyzer</div>
        <InputRetriever />
      </Container>
    </div>
  );
}

export default App;

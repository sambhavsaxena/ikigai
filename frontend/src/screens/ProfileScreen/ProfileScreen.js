import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import "./ProfileScreen.css";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../actions/userActions";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setPic] = useState();

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, error, success } = userUpdate;

  useEffect(() => {
    if (!userInfo) {
      history.push("/");
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPic(userInfo.pic);
    }
  }, [history, userInfo]);

  const postDetails = (pics) => {
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "monospace");
      data.append("cloud_name", "dcprhtqwe");
      fetch("https://api.cloudinary.com/v1_1/dcprhtqwe/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
      toast.warn(`Uploading image...`, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email, pic }));
  };

  return (
    <MainScreen title="Edit profile">
      <div>
        <Row className="profileContainer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '100px' }}>
          <Col md={6}>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" style={{ marginBottom: '20px', width: '500px', textAlign: 'center' }}>
                {loading && <Loading />}
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                {success && <ErrorMessage variant="success">Updated successfully</ErrorMessage>}
                <Form.Control
                  required
                  className="text-center"
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="email" style={{ marginBottom: '20px', width: '500px', textAlign: 'center' }}>
                <Form.Control
                  required
                  className="text-center"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="pic" style={{ marginBottom: '20px', width: '500px', textAlign: 'center' }}>
                <Form.File
                  onChange={(e) => postDetails(e.target.files[0])}
                  id="custom-file"
                  type="image/png"
                  accept="image/png, image/jpeg, image/jpg"
                  label="Upload a new picture"
                  custom
                />
              </Form.Group>
              <Form.Group style={{ marginBottom: '20px', width: '500px', textAlign: 'center' }}>
                <Button type="submit" varient="primary">
                  Update
                </Button> <br />
                <Button href="/resetpassword" varient="primary" style={{ marginTop: '20px' }}>
                  Change password
                </Button>
              </Form.Group>
            </Form>
          </Col>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={pic} alt={name} className="profilePic" style={{ width: '50vh', height: '50vh', borderRadius: '50%', margin: 'auto' }} />
          </Col>
        </Row>
      </div>
    </MainScreen >
  );
};

export default ProfileScreen;

import React, { useState , useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';


function App() {
  const baseUrl="https://localhost:44313/api/book";
  const [data, setData]=useState([]);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [gestorSeleccionado, setGestorSeleccionado]=useState({
    IdBook: '',
    Name: '',
    Section: '',
    Description: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setGestorSeleccionado({
      ...gestorSeleccionado,
      [name]: value
    });
    console.log(gestorSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

   const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
      console.log(data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    delete gestorSeleccionado.IdBook;
    
    await axios.post(baseUrl, gestorSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    
    await axios.put(baseUrl+"/"+gestorSeleccionado.IdBook, gestorSeleccionado)
    .then(response=>{
      var respuesta=response.data;
      var dataAuxiliar=data;

      dataAuxiliar.forEach(function (gestor)  {
        
        if(gestor.IdBook===gestorSeleccionado.IdBook){
          gestor.Name=respuesta.Name;
          gestor.Section=respuesta.Section;
          gestor.Description=respuesta.Description;
        }
      });
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+gestorSeleccionado.IdBook)
    .then(response=>{
     setData(data.filter(gestor=>gestor.IdBook!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarGestor=(gestor, caso)=>{
    setGestorSeleccionado(gestor);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }

  useEffect(()=>{
    peticionGet();
  },[])
  return (
    <div className="App">
      <br/><br/>
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insert new book</button>
      <br/><br/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Section</th>
            <th>Description</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
      


        { data.map(gestor=>(
          <tr key={gestor.IdBook}>
            <td>{gestor.IdBook}</td>
            <td>{gestor.Name}</td>
            <td>{gestor.Section}</td>
            <td>{gestor.Description}</td>
            <td>
              <button className="btn btn-primary" onClick={()=>seleccionarGestor(gestor, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>seleccionarGestor(gestor, "Eliminar")}>Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>

      </table>

      <Modal isOpen={modalInsertar}>
      <ModalHeader>Insert Book</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Name: </label>
          <br />
          <input type="text" className="form-control" name="Name"  onChange={handleChange}/>
          <br />
          <label>Section: </label>
          <br />
          <input type="text" className="form-control" name="Section" onChange={handleChange}/>
          <br />
          <label>Descripcion: </label>
          <br />
          <input type="text" className="form-control" name="Description" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEditar}>
      <ModalHeader>Edit Book</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>ID: </label>
          <br />
          <input type="text" className="form-control" readOnly value={gestorSeleccionado && gestorSeleccionado.IdBook}/>
          <br />
          <label>Name: </label>
          <br />
          <input type="text" className="form-control" name="Name" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.Name}/>
          <br />
          <label>Section: </label>
          <br />
          <input type="text" className="form-control" name="Section" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.Section}/>
          <br />
          <label>description: </label>
          <br />
          <input type="text" className="form-control" name="Description" onChange={handleChange} value={gestorSeleccionado && gestorSeleccionado.Description}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>


    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el Gestor de Base de datos {gestorSeleccionado && gestorSeleccionado.Name}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;

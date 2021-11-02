import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletEvent, LeafletMouseEvent } from 'leaflet'
import api from '../../services/api';
import Dropzone from '../../components/Dropzone';
import logo from '../../assets/logo.svg';
import './styles.css';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

const CreateLocation: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);

    const [selectMapPosition, setSelectedMapPosition] = useState<[number, number]>([0, 0]);
   
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        city: '',
        uf: '',
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => { 
        api.get('items').then(response => {
            setItems(response.data);
        })
    },[]);

    const handleMapClick = useCallback((event: LeafletMouseEvent): void => {
        //console.log(event);
        setSelectedMapPosition([
            event.latlng.lat,
            event.latlng.lng,
        ]);
    }, []);

    const handleInputCHange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        //console.log(event.target.name, event.target.value);
        const { name, value } = event.target;
        setFormData({...formData, [name]: value });
    }, [formData]);

    const handleSelectItem = useCallback((id: number) =>{
        //setSecletedItems([... selectedItems, id]);
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([... selectedItems, id]);
        }
    }, [selectedItems]);

    const handleSubmit = useCallback(async(event: FormEvent) =>{
        event.preventDefault();

        const {city, email, name, uf, whatsapp} = formData;
        const [latitude, longitude] = selectMapPosition;
        const items = selectedItems;

        const data = {
            city,
            email,
            name,
            uf,
            whatsapp,
            latitude,
            longitude,
            items,
        };
        
        await api.post('locations', data);

        alert('Estabelecimento cadastrado com sucesso!');

        history.push('/');
    }, [formData, selectedItems, setSelectedMapPosition])

    return (
        <div id="page-create-location">
            <div className="content">
                <header>
                    <img src={logo} alt="Coleta Seletiva"/>
                    <Link to="/">
                        <FiArrowLeft/>
                        Voltar para Home
                    </Link>
                </header>

                <form onSubmit={handleSubmit}>
                    <h1>Cadastro do <br/> local de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <Dropzone onFileUploaded={setSelectedFile} />

                    <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input 
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputCHange}
                            />
                        </div>
                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input 
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleInputCHange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input 
                                    type="text"
                                    name="whatsapp"
                                    id="whatsapp"
                                    onChange={handleInputCHange}
                                />
                            </div>
                        </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Marque o endereço no mapa</span>
                    </legend>
                    <Map center={[-23.0003709, -43.365895]} zoom={14} onclick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                        <Marker position={selectMapPosition}/>
                    </Map>
                    <div className="field-group">
                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <input 
                                    type="text"
                                    name="city"
                                    id="city"
                                    onChange={handleInputCHange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="uf">Estado</label>
                                <input 
                                    type="text"
                                    name="uf"
                                    id="uf"
                                    onChange={handleInputCHange}
                                />
                            </div>
                        </div>
                    </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens coletados</h2>
                        <span>Você pode marcar um ou mais items</span>
                    </legend>
                <ul className="items-grid">
                    {items.map(item => (
                    <li 
                    key={item.id} 
                    onClick={() => handleSelectItem(item.id)}
                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                    >
                    <img src="{item.image_url}" alt={item.title}/>    
                    </li>
                    ))}
                </ul>
                </fieldset>
                <button type='submit'>
                    Cadastrar local de coleta
                </button>
                </form>
            </div>
        </div>
    );
}

export default CreateLocation;
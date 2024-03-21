import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import "../components.css";
import { BASE_URL } from "../../App";
import { RenderNewStoreForm, RenderEditStoreForm, RenderDeleteStoreForm } from "./RenderStoreForms";
import StoreTableMap from "./StoreTableMap";

function StoresList(){
    const [store, setStore] = useState([]);
    const [newstoreform, setNewstoreform] = useState(false);
    const [editstoreform, setEditstoreform] = useState(false);
    const [deletestoreform, setDeletestoreform] = useState(false);
    
    const [argid, setArgid] = useState(0);
    const [argname, setArgname] = useState('');
    const [argaddress, setArgaddress] = useState('');

    const [dataChanged, setDataChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperPage = 6;         // adjust number of items as per required.

    const NewStoreAction = () => {
        setNewstoreform(!newstoreform);        
    }
    const EditStoreAction = () => {
        setEditstoreform(!editstoreform);        
    }
    const DeleteStoreAction = () => {
        setDeletestoreform(!deletestoreform);        
    }
    const EditFormArgs = (id1, name1, address1, FormFunction) => {
        setArgid(id1);
        setArgname(name1);
        setArgaddress(address1);
        FormFunction();     
    }
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }
    const fetchStores = async () => {
        try{
            const newstore = await axios.get(`${BASE_URL}/api/Store`);
            if (newstore.data.length > 0){
                setStore(newstore.data);
            } else {
                alert("Store data is empty.");
            }

        }
        catch{
            alert("Error: Cannot fetch Stores.");
        }
    }
    useEffect(
        () => {            
            fetchStores();
        }
    , [currentPage, dataChanged]);

    const pageCount = Math.ceil(store.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = store.slice(indexOfFirstRecord, indexOfLastRecord);

    return(
        <div id = "mainblock">
            <Button color='blue' onClick={NewStoreAction}>New Store</Button>
            <div id="tablediv">
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Address</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((store) => 
                            {
                                const id = store?.id ? store.id : 0;
                                const name = store?.name ? store.name : "";
                                const address = store?.address ? store.address : "";
                                    
                                return (
                                    <StoreTableMap 
                                        key={`Store-${new Date().toLocaleDateString()}-${id}`} 
                                        customer={store}
                                        EditFormArgs = {EditFormArgs}
                                        EditFormAction = {EditStoreAction}
                                        DeleteFormAction = {DeleteStoreAction}                                         
                                    />
                                )                                
                            }                            
                        )}
                    </TableBody>
                </Table>
                <RenderNewStoreForm condition={newstoreform} formAction={NewStoreAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderEditStoreForm condition={editstoreform} Id={argid} Name={argname} Address={argaddress} formAction = {EditStoreAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderDeleteStoreForm condition={deletestoreform} Id={argid} Name={argname} Address={argaddress} formAction={DeleteStoreAction} updateChange={() => {setDataChanged(!dataChanged)}}/>                
            </div>
            <div className="nav_panel">
                <PaginationRender 
                    pageCount={pageCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
                <div className="pagenumber">
                    {currentPage}
                </div>
            </div>
        </div>
    )
}

export default StoresList;
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import "../components.css";
import { BASE_URL } from "../../App";
import { getCustomers, getProducts, getStores } from "./SalesUtil";
import DeleteSalesForm from "./DeleteSalesForm";
import EditSalesForm from "./EditSalesForm";
import NewSalesForm from "./NewSalesForm";
import { RenderNewSalesForm, RenderEditSalesForm, RenderDeleteSalesForm } from "./RenderSalesForms";

function SalesList(){
    const [sales, setSales] = useState([]);    
    const [newsalesform, setNewsalesform] = useState(false);
    const [editsalesform, setEditsalesform] = useState(false);
    const [deletesalesform, setDeletesalesform] = useState(false);

    const [argid, setArgid] = useState(0);

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    
    const [dataChanged, setDataChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperPage = 6;         // adjust number of items as per required.

    const NewSalesAction = ()=>{
        setNewsalesform(!newsalesform);        
    }
    const EditSalesAction = ()=>{
        setEditsalesform(!editsalesform);        
    }
    const DeleteSalesAction = ()=>{
        setDeletesalesform(!deletesalesform);        
    }
    const EditFormArgs = (id1, FormFunction) => {
        setArgid(id1);        
        FormFunction();     
    }
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }
    const fetchSales = async () => {
        try{
            const newsales = await axios.get(`${BASE_URL}/api/Sales`);
            setSales(newsales.data);
            
            const cResponse = await getCustomers();
            setCustomers(cResponse.data)
            
            const pResponse = await getProducts();
            setProducts(pResponse.data);
            
            const sResponse = await getStores();
            setStores(sResponse.data);            
        }
        catch{
            alert("Error: Cannot fetch Sales.");
        }
    }
    useEffect(
        () => {            
            fetchSales();
        }
    ,[currentPage, dataChanged]);

    const pageCount = Math.ceil(sales.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = sales.slice(indexOfFirstRecord, indexOfLastRecord);

    let count = 0;
    const GetCustomerName = (id) => {
        const match = customers.find( custmr => custmr.id == id);                
        return match?.name;
    }
    const GetProductName = (id) => {
        const match = products.find( prod => prod.id == id);
        return match?.name;
    }
    const GetStoreName = (id) => {
        const match = stores.find( stor => stor.id == id);
        return match?.name;
    }

    return(
        <div id="mainblock">
            <Button color='blue' onClick={NewSalesAction}>New Sale</Button>
            <div id="tablediv">            
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Product</TableHeaderCell>
                            <TableHeaderCell>Customer</TableHeaderCell>
                            <TableHeaderCell>Store</TableHeaderCell>
                            <TableHeaderCell>Date Sold</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map(item => (
                            <TableRow key={item.id}>                                
                                <TableCell>{GetProductName(item.productId)}</TableCell>
                                <TableCell>{GetCustomerName(item.customerId)}</TableCell>
                                <TableCell>{GetStoreName(item.storeId)}</TableCell>
                                <TableCell>{(new Date(item.dateSold).toLocaleDateString())}</TableCell>
                                <TableCell>
                                    <Button color='yellow' onClick={ () => EditFormArgs(item.id, EditSalesAction) } icon='edit' labelPosition="left" content='Edit' >
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button color='red' onClick={ () => EditFormArgs(item.id, DeleteSalesAction) } icon='trash' labelPosition="left" content='Delete' >
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <RenderNewSalesForm condition={newsalesform} formAction={NewSalesAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderEditSalesForm condition={editsalesform} Id={argid} formAction={EditSalesAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderDeleteSalesForm condition={deletesalesform} Id={argid} formAction={DeleteSalesAction} updateChange={() => {setDataChanged(!dataChanged)}}/>

                {/* {newsalesform ? <NewSalesForm callback={NewSalesAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {editsalesform ? <EditSalesForm editid={argid} callback={EditSalesAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {deletesalesform ? <DeleteSalesForm deleteid={argid} callback={DeleteSalesAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null} */}
            </div>
            <div>
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

export default SalesList;
import axios from "axios";
import { useState, useEffect } from "react";
import { BASE_URL } from "../App";
import { ErrorComponent } from "./utils";
import { PaginationRender } from "./PaginationRender";
import {Button, Modal, Form, Header} from "semantic-ui-react";
import {Table, TableRow, TableHeader, TableHeaderCell, TableCell, TableBody} from "semantic-ui-react";

const getCustomers = async () => {
    const url = `${BASE_URL}/api/Customer`;
    console.log(url);    
    const fetch_cstm = await axios.get(url);
    return (fetch_cstm !== null) ? fetch_cstm : null;
}

const getProducts = async () => {
    const url = `${BASE_URL}/api/Product`;
    console.log(url);    
    const fetch_prds = await axios.get(url);
    return (fetch_prds !== null) ? fetch_prds : null;
}

const getStores = async () => {
    const url = `${BASE_URL}/api/Store`;
    console.log(url);    
    const fetch_stores = await axios.get(url);
    return (fetch_stores !== null) ? fetch_stores : null;
}

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
        console.log(`newsalesform: ${newsalesform}`);
    }
    const EditSalesAction = ()=>{
        setEditsalesform(!editsalesform);
        console.log(`editsalesform: ${editsalesform}`);
    }
    const DeleteSalesAction = ()=>{
        setDeletesalesform(!deletesalesform);
        console.log(`deletesalesform: ${deletesalesform}`);
    }
    const EditFormArgs = function(id1, FormFunction){
        setArgid(id1);        
        FormFunction();     
    }
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }

    useEffect(
        () => {
            const fetchSales = async function(){
                const newsales = await axios.get(`${BASE_URL}/api/Sales`);
                //console.log(newsales.data);
                setSales(newsales.data);
                //console.log(newsales.data);                
                console.log("sales: ");
                console.log(sales);
                
                const cResponse = await getCustomers();
                setCustomers(cResponse.data)
                console.log("customers");
                console.log(customers);
                console.log("--------------------");
                const pResponse = await getProducts();
                setProducts(pResponse.data);
                console.log("products");
                console.log(products);
                console.log("--------------------");
                const sResponse = await getStores();
                setStores(sResponse.data);
                console.log("stores");
                console.log(stores);
            }
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
        // console.log(`count: ${++count} cid:${id}`);
        // console.log(match)
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
                {newsalesform ? <NewSalesForm callback={NewSalesAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {editsalesform ? <EditSalesForm editid={argid} callback={EditSalesAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {deletesalesform ? <DeleteSalesForm deleteid={argid} callback={DeleteSalesAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
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

function DeleteSalesForm(props){
    const {deleteid, callback, dataChange} = props;
    const [errorString, setErrorString] = useState('');
    let openForm = true;

    console.log(`delete id: ${deleteid}`);
    const fetchURL = `${BASE_URL}/api/Sales/deletesales?id=${deleteid}`;
    console.log(`fetchURL => ${fetchURL}`);
    const handleDeleteForm = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post(fetchURL);
            alert(response.status);
            // callback invoke
            callback();
            dataChange();
        }
        catch (error){
            let errorMsg = error.message + ".\n" + error.response.data.errors.Name;
            //console.log(errorMsg);            
            setErrorString(errorMsg);
        }
    }

    return(
        <Modal as={Form} onSubmit={handleDeleteForm} open={openForm} size='tiny' onOpen={() => {setErrorString('')}}>            
            <Header as='h2'>Delete sales</Header>
            <Header as='h3'>Are you sure?</Header>                    
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback} content='cancel' />
                <Button color='red' type = "submit" icon='times' labelPosition="right" content='delete' />
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>
    )
}

// Sort this out
function EditSalesForm(props){
    const {editid, callback, dataChange} = props;    
    const [errorString, setErrorString] = useState('');
    let openForm = true;

    const [ipproduct, setIpproduct] = useState('')
    const [ipcustomer, setIpcustomer] = useState('')
    const [ipstore, setIpstore] = useState('');
    const [ipdate, setIpdate] = useState('');
    
    const [productOptions, setProductOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [storeOptions, setStoreOptions] = useState([]);
    
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [storeList, setStoreList] = useState([]);    

    useEffect( 
        () => {
            const GetFKeyName = async () => {                
                // Fetch products table
                const productFetch = await getProducts();
                const products = productFetch.data.map( item => item.name);
                setProductList(productFetch.data);          // All Products data                
                setProductOptions( productFetch.data.map( (item, index) => {return {key: index, value: item.name, text: item.name};} ) );
                // Fetch Customers table
                const cstomerFetch = await getCustomers();
                const customers = cstomerFetch.data.map( item => item.name);
                setCustomerList(cstomerFetch.data);          // All Customer data
                setCustomerOptions(cstomerFetch.data.map( (item, index) => {return {key: index, value: item.name, text: item.name}}));
                // Fetch stores table
                const storeFetch = await getStores();
                const stores = storeFetch.data.map( item => item.name);
                setStoreList(storeFetch.data);          // All Store data
                setStoreOptions(storeFetch.data.map( (item, index) => {return {key: index, value: item.name, text: item.name}}));       // All store names
                
                // Fetch sales item by ID
                console.log("editid");console.log(editid);
                const fetchSalesById = await axios.get(`${BASE_URL}/api/Sales/${editid}`);
                // get Sales Foreign key IDs by name
                const get_productID = fetchSalesById.data.productId;
                const get_customerID = fetchSalesById.data.customerId;
                const get_storeID = fetchSalesById.data.storeId;
                
                const prod_match = productFetch.data.find( item => item.id == get_productID );
                const get_productName = prod_match?.name;
                const cstomer_match = cstomerFetch.data.find( item => item.id == get_customerID );
                const get_customerName = cstomer_match?.name;
                const store_match = storeFetch.data.find( item => item.id == get_storeID );
                const get_storeName = store_match?.name;
                
                setIpproduct(get_productName);
                setIpcustomer(get_customerName);
                setIpstore(get_storeName);
                setIpdate(fetchSalesById.dateSold);
                // console.log(`ipproduct: ${ipproduct}`);
                // console.log(`ipcustomer: ${ipcustomer}`);
                // console.log(`ipstore: ${ipstore}`);
                // console.log(`ipdate: ${ipdate}`);
                
            };
            GetFKeyName();
        }, []
    );

    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();
        console.log(`ipproduct: ${ipproduct}`);
        console.log(`ipcustomer: ${ipcustomer}`);
        console.log(`ipstore: ${ipstore}`);
        console.log(`ipdate: ${ipdate}`);
        
        // get product ID
        const ipproductId = (productList.find( item => item.name == ipproduct))?.id;
        console.log(`ipproductId: ${ipproductId}`);
        const ipcustomerId = (customerList.find( item => item.name == ipcustomer))?.id;
        console.log(`ipcustomerId: ${ipcustomerId}`);
        const ipstoreId = (storeList.find( item => item.name == ipstore))?.id;
        console.log(`ipstoreId: ${ipstoreId}`);

        try{
            const response = await axios.post(`${BASE_URL}/api/Sales/updatesales?id=${editid}`,
                {
                    productId: ipproductId,
                    customerId: ipcustomerId,
                    storeId: ipstoreId,
                    dateSold: ipdate
                }
            );
            const {data} = response;
            console.log(response);
            alert(response.status);
            
            // form close callback
            callback();
            dataChange();
        }
        catch (error){
            let errorMsg = error.message + ".\n" + error.response.data.errors.Name;
            //console.log(errorMsg);            
            setErrorString(errorMsg);
        }
    }

    return(
        <Modal as={Form} onSubmit={handleForm} open={openForm} size="tiny" onOpen={() => setErrorString('')}>
            
            <Header as='h2'>Edit sales</Header>
            <Modal.Content>
                <Form.Input label='Edit sales' required type="datetime-local" value={ipdate} onChange={ e => setIpdate(e.target.value) } />
                    
                <Form.Select label='Product' required options={ productOptions } value={ipproduct} 
                    onChange={(e, data) => setIpproduct(data.value)}
                />

                <Form.Select label='Customer' required options={ customerOptions} value={ipcustomer} 
                    onChange={(e, data) => setIpcustomer(data.value)}
                />

                <Form.Select label='Store' required options={ storeOptions} value={ipstore} 
                    onChange={(e, data) => setIpstore(data.value)}
                />
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' type="button" onClick={callback}  content='cancel'/>
                <Button color='green' type="submit" icon='check' labelPosition="right" content='Edit'/>
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}
        </Modal>
    )
}

function NewSalesForm(props){
    const [ipproduct, setIpproduct] = useState('');
    const [ipcustomer, setIpcustomer] = useState('');
    const [ipstore, setIpstore] = useState('');
    const [ipdate, setIpdate] = useState('');
    
    const [productOptions, setProductOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [storeOptions, setStoreOptions] = useState([]);
    
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [storeList, setStoreList] = useState([]);

    let openForm = true;
    const [errorString, setErrorString] = useState('');

    useEffect( 
        () => {
            const GetFKeyName = async () => {            
                const pfetch = await getProducts();
                const products = pfetch.data.map( item => item.name);
                setProductList(pfetch.data);
                setProductOptions( pfetch.data.map( (item, index) => {return {key: index, value: item.name, text: item.name};} ) );
                const cfetch = await getCustomers();
                const customers = cfetch.data.map( item => item.name);
                setCustomerList(cfetch.data);
                //setAllcustomernames(customers);
                setCustomerOptions( cfetch.data.map( (item, index) => {return {key: index, value: item.name, text: item.name};} ) );
                const sfetch = await getStores();
                const stores = sfetch.data.map( item => item.name);
                setStoreList(sfetch.data);
                //setAllstorenames(stores);
                setStoreOptions( sfetch.data.map( (item, index) => {return {key: index, value: item.name, text: item.name};} ) );
                // Set default value so as not make empty states
                setIpproduct(products[0]);
                setIpcustomer(customers[0]);
                setIpstore(stores[0]);
            };
            GetFKeyName();
        }, []
    );    

    const handleForm = async (event) => {
        // add form submission here
        event.preventDefault();
        console.log(`ipproduct: ${ipproduct}`);
        console.log(`ipcustomer: ${ipcustomer}`);
        console.log(`ipstore: ${ipstore}`);
        console.log(`ipdate: ${ipdate}`);
        
        // get product ID
        const ipproductId = (productList.find( item => item.name == ipproduct))?.id;
        console.log(`ipproductId: ${ipproductId}`);
        const ipcustomerId = (customerList.find( item => item.name == ipcustomer))?.id;
        console.log(`ipcustomerId: ${ipcustomerId}`);
        const ipstoreId = (storeList.find( item => item.name == ipstore))?.id;
        console.log(`ipstoreId: ${ipstoreId}`);

        try{
            const response = await axios.post(`${BASE_URL}/api/Sales/createsales`,
                {
                    productId: ipproductId,
                    customerId: ipcustomerId,
                    storeId: ipstoreId,
                    dateSold: ipdate
                }
            );
            console.log(response);
            alert(response.status);
            
            // form close callback
            props.callback();
            props.dataChange();
        }
        catch (error){
            let errorMsg = error.message + ".\n" + error.response.data.errors.Name;
            //console.log(errorMsg);            
            setErrorString(errorMsg);
        }
    }

    return(
        <Modal as={Form} onSubmit={handleForm} open={openForm} size="tiny" onOpen={() => {setErrorString('')}}>
            
            <Header as='h2' content='Create sales' />
            <Modal.Content>
            
            <Form.Input label='Date sold' required type="datetime-local" value={ipdate} onChange={ e => setIpdate(e.target.value) } />
            
            <Form.Select label='Product' required options={ productOptions } value={ipproduct} 
                onChange={(e, data) => setIpproduct(data.value)}                
            />
            <Form.Select label='Customer' required options={ customerOptions } value={ipcustomer} 
                onChange={(e, data) => setIpcustomer(data.value)}
            />

            <Form.Select label='Store' required options={ storeOptions } value={ipstore}  
                onChange={(e, data) => setIpstore(data.value)}                
            />
            </Modal.Content>

            <Modal.Actions>
                <Button color='black' type="button" onClick={props.callback} content='Cancel' />
                <Button color='red' type="submit" icon="check" labelPosition="right" content='Create'/>
            </Modal.Actions>
            {errorString ? <ErrorComponent text={errorString} />: null}            
        </Modal>
    )
}

export default SalesList;
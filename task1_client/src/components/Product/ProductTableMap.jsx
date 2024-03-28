import React from "react";
import {TableCell, TableRow, Button} from "semantic-ui-react";

function ProductTableMap(props){
    const {product, EditFormArgs, EditFormAction, DeleteFormAction} = props;

    const id = product.id;
    const name = product?.name ? product.name : "";
    const price = product?.price ? product.price : "";
        
    return(
        <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{price}</TableCell>
            <TableCell>
                <Button 
                    color="yellow" 
                    onClick={ () => EditFormArgs(id, name, price, EditFormAction) } 
                    icon="edit" 
                    labelPosition="left" 
                    content="Edit">                                        
                </Button>
            </TableCell>
            <TableCell>
                <Button 
                    color="red" 
                    onClick={ () => EditFormArgs(id, name, price, DeleteFormAction) } 
                    icon="trash" 
                    labelPosition="left" 
                    content="Delete">                                    
                </Button>
            </TableCell>
        </TableRow>
    )    
}

export default ProductTableMap;
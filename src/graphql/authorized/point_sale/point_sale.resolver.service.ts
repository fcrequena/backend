import { MiddlewareType, middlewareCheck } from "../../../middlewares/middleware.check";
import PointSaleMutationService from "./point_sale.mutation.service";
import PointSaleQueryService from "./point_sale.query.service";
import { valPointSale } from "../../../middlewares/middleware.validation";

import ProductPointSaleQueryService from "../productPointSale/productPointSale.query.service";
import ProductQueryService from "../product/product.query.service";

import { IProduct } from "../../../interfaces/db.interface";

const pointSaleQueryService = new  PointSaleQueryService();
const pointSaleMutationService  = new  PointSaleMutationService();
const productPointSaleQueryService = new ProductPointSaleQueryService();
const productQueryService = new ProductQueryService();

const pointSaleResolver = {
    Query: {
        getAllPointSale(parent, params, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['point_sale_view']}
                ],
                ctx
            )
            return pointSaleQueryService.getAllPointSale();
        },
        getPointSaleById(parent, {codigo}, ctx){
            middlewareCheck(
                [
                    {type: MiddlewareType.AUTH},
                    {type: MiddlewareType.ACL, 
                        roles: ['point_sale_search']}
                ],
                ctx
            )
            return pointSaleQueryService.getPointSaleById(codigo);
        },
    },
    PointSale:{
        productos: async (params) => {
            const product_PointSale = await productPointSaleQueryService.getFindByPointSaleId(params.codigo);
            const producto = await productQueryService.getAllProduct();    

            let arrayProductos = [];// = new Array<IProduct> ;

            product_PointSale.forEach(ppSale => {
                const resultado = producto.find( (prod) => prod.codigo == ppSale.producto)
                console.log({resultado})
                // let {codigo, nombre, descripcion, activo, tipo_producto} = resultado;

                // arrayProductos.push( {
                //     puv_codigo: ppSale.codigo, 
                //     pro_codigo: codigo, 
                //     pro_nombre: nombre, 
                //     pro_descripcion: descripcion, 
                //     puv_precio: ppSale.precio, 
                //     puv_activo: ppSale.activo
                // } )

            })
            return arrayProductos
        }
    },
    Mutation: {
        async deletePointSaleById(parent, params, ctx){
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_sale_delete']}
            ], ctx)
            
            await valPointSale(params, 'delete');

            const result = await pointSaleMutationService.deletePointSaleById(params);
            return result;
        },
        async createPointSale(parent, params, ctx){
            console.log({resolver: params})
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_sale_create']}
            ], ctx)
            
            await valPointSale(params, 'create');

            const result = await pointSaleMutationService.createPointSale(params);
            return result;
        },
        async updatePointSale(parent, params, ctx){
            
            middlewareCheck([
                {type: MiddlewareType.AUTH},
                {type: MiddlewareType.ACL,
                    roles: ['point_sale_update']}
            ], ctx)
            
            await valPointSale(params, 'update');

            const result = await pointSaleMutationService.updatePointSale(params);
            
            return result;
        },
    }
}

export default pointSaleResolver;
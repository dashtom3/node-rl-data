'use strict';
import SubshopModel from '../../models/system/subshop'
import formidable from 'formidable'
import dtime from 'time-formater'

class Subshop {
	constructor(){
		
    }
    async operateShop(req, res, next){
        console.log(11)
        const {token} = req.query
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 0,
					type: 'FORM_DATA_ERROR',
					message: '表单信息错误'
				})
				return
			}
            
            const {action,data} = fields;
			try{
				if (action == null || data ==null ) {
					throw new Error('参数错误')
                }
			}catch(err){
				res.send({
					status: 0,
					type: 'ERROR',
					message: err.message,
				})
				return
			}
			try{
                switch (action) {
                    case 0:
                        data.create_time = dtime(new Date()).format('YYYY-MM-DD HH:mm:ss')
                        await SubshopModel.create(data)
                        break;
                    case 1:
                        await SubshopModel.findOneAndUpdate({_id:data._id},{$set:data})
                        break;
                    case 2:
                        await SubshopModel.findOneAndRemove({_id:data._id})
                        break;
                    default:
                        break;
                }
                res.send({
                    status: 1,
                    message: '成功',
                })
			}catch(err){
				res.send({
					status: 0,
					type: 'ERROR',
					message: '失败',
				})
			}
		})
    }
    async getShopList(req, res, next){
        const {token} = req.query
		try{
			if (token == null ) {
				throw new Error('参数错误')
            }
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR',
                message: err.message,
            })
            return
        }
        try{
            const resData = await SubshopModel.find().populate('device')
            res.send({
                status: 1,
                data:resData,
                message: '访问成功',
            })
        }catch(err){
            res.send({
                status: 0,
                type: 'ERROR',
                message: '访问失败',
            })
        }
	}
	
}

export default new Subshop()
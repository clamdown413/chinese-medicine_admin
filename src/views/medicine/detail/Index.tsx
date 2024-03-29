import { getMedicineInfoById, selectOperateById } from '@/api/medicine';
import { Button } from 'antd';
import Badge from 'antd/es/badge';
import Descriptions from 'antd/es/descriptions';
import { AxiosResponse } from 'axios';
import { FC, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
// import { encryption, decrypt } from "@/utils/crypto"
interface IIndexProps {

};

const Index: FC<IIndexProps> = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const [id] = useState<number>(Number(searchParams.get("id")))
    const [medicineData, setMedicineData] = useState({
        buy_price: 0,
        grow_place: '',
        id: 0,
        last_data: '',
        medicine_number: 0,
        name: '',
        operate_id: '',
        operate_mouth: '',
        sale_price: 0
    })
    const [operate_mouth, setOperate_mouth] = useState([])
    const [operate_ids, setOperate_ids] = useState([])
    const [operateList, setOperateList] = useState<any>([])
    const getMedicineInfo = () => {
        getMedicineInfoById({ id }).then(res => {
            console.log(res.data.data);

            setMedicineData(res.data.data[0]);
        })
    }
    useEffect(() => {
        getMedicineInfo()
    }, [id])

    useEffect(() => {
        setOperate_mouth(JSON.parse(medicineData.operate_mouth || "[]"))
        setOperate_ids(JSON.parse(medicineData.operate_id || "[]"))
    }, [medicineData])

    useEffect(() => {
        let data = []
        let getOperateData = (operate_ids: any) => {
            let data: Promise<AxiosResponse<any, any>>[] = []
            operate_ids.forEach((item: any) => {
                data.push(selectOperateById({ operate_id: item }))
            });
            return data;
        }

        Promise.all(getOperateData(operate_ids)).then(values => {
            data = values
            console.log(data);

            setOperateList(data)
        });
    }, [operate_ids])


    return (
        <>
            <Button style={{
                position: 'absolute',
                right: 50

            }}>修改数据</Button>

            <Descriptions title={medicineData.name} layout="vertical" bordered>
                <Descriptions.Item label="产地">{medicineData.grow_place}</Descriptions.Item>
                <Descriptions.Item label="收购价格/斤">{medicineData.buy_price}元</Descriptions.Item>
                <Descriptions.Item label="出售价格/斤">{medicineData.sale_price}元</Descriptions.Item>
                <Descriptions.Item label="现存数量/斤">{medicineData.medicine_number}</Descriptions.Item>
                <Descriptions.Item label="最后收购时间" span={2}>
                    {medicineData.last_data}
                </Descriptions.Item>
                <Descriptions.Item label="状态" span={3}>
                    <Badge status="processing" text="正常" />
                </Descriptions.Item>

                <Descriptions.Item label="流程信息">
                    {
                        Number(medicineData.last_data.substring(0, 4)) - 1
                    }年
                    <br />
                    {operateList.map((item: any, index: any) => {
                        return (

                            <><li key={index}>{operate_mouth[index]}月{item.data.data[0].operate_detail}</li></>)
                    })}
                </Descriptions.Item>
            </Descriptions>
            <Button
                onClick={() => {
                    navigate(-1)
                }}
            >{"<"}返回</Button>
        </>)
};

export default Index;
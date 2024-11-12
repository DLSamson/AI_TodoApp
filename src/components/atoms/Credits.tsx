import { Card } from "@/components/atoms/Card";
import { GridLayout } from "@/components/layouts/GridLayout";
import { FaCircleInfo } from "react-icons/fa6";

export const Credits = () => (
    <Card>
        <GridLayout>
            <div className="flex flex-col gap-4">
                <p className="flex gap-4">
                    <FaCircleInfo size={24} />
                    Информация об авторе
                </p>

                <p>Работу выполнил студент группы ДБИ-481рсоб <span className="p-2 bg-blue-400 text-white rounded-xl">Гармаш Данила Иванович</span></p>
            </div>
        </GridLayout>
    </Card>
)
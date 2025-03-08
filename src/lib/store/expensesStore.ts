import axios from "axios";
import { create } from "zustand";


interface Expenses {
    expenses : [
        {
            id: string
            userId: string,
            categoryId: string,
            amount: number,
            isOverLimit: boolean,
            description: string,
            createdAt: string,
            updatedAt: string,
            category:{
                name: string,
                limit: number
            },
            totalSpent: number
        }
    ]
}
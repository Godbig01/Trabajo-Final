// 📄 components/showToast.tsx
 
import { toast } from '@pheralb/toast';
 
export const ShowToastSuccess = ({message}) => {
    (message);
    
    toast.success({ 
        text: 'La operación se ha realizado con éxito', 
        description: message,
    });
}

export const ShowToastError = ({message}) => {
    
    toast.error({ 
        text: 'Ha ocurrido un error', 
        description: message,
    });
}


import api from "./axios";

/**
 * 
 * @returns {*}
 */
export const getNominas = () => api.get("/nominas");

/**
 * 
 * @param reciboId
 * @returns {*}
 */
export const getNominaById = (reciboId) =>
    api.get(`/nominas/${reciboId}`);
/**
 * 
 * @param data
 * @returns {*}
 */
export const createNomina = (data) =>
    api.post("/nominas", data);

/**
 * 
 * @param reciboId
 * @param data
 * @returns {Promise<void> | IDBRequest<IDBValidKey>}
 */
export const updateNomina = (reciboId, data) =>
    api.put(`/nominas/${reciboId}`, data);
/**
 * 
 * @param reciboId
 * @returns {*}
 */
export const deleteNomina = (reciboId) =>
    api.delete(`/nominas/${reciboId}`);
/**
 * 
 * @param reciboId
 * @returns {*}
 */
export const downloadXML = (reciboId) =>
    api.get(`/nominas/${reciboId}/xml`, {
        responseType: "blob",
    });
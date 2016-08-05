import {Inject} from "../utils/Decorators"
import {Service} from "../utils/Angular2to1/Angular2to1"

@Service("GalleryService")
export class GalleryService
{

    /**
     * @type {ApiService}
     */
    @Inject ApiService;

    /**
     * @type {Upload}
     */
    @Inject Upload;

    /**
     * Returns a list with all galleries
     */
    all()
    {
        return this.ApiService.get(`/galleries`);
    }

    /**
     * Attempts to create a new gallery with the specified
     * name
     * @param name
     */
    create(name)
    {
        return this.ApiService.post(`/galleries`, {name});
    }

    /**
     * Deletes the given gallery
     * @param gallery
     */
    delete(gallery)
    {
        return this.ApiService.delete(`/galleries/${gallery.id}`);
    }

    /**
     * Changes the name of the gallery
     * @param gallery
     * @param name
     * @return {*}
     */
    editName(gallery, name)
    {
        return this.ApiService.put(`/galleries/${gallery.id}`, {name})
    }

    /**
     * Uploads all image files to the given gallery
     * @param gallery
     * @param images
     */
    uploadImages(gallery, images)
    {
        return this.Upload.upload({
            url : this.ApiService.apiURL(`/galleries/${gallery.id}/images`),
            data : { file : images }
        });
    }
}

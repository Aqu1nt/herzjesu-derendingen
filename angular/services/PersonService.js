import {Service, Inject} from "ng-next"

@Service("PersonService")
export class PersonService
{

    @Inject ApiService;

    all()
    {
        return this.ApiService.get("/persons");
    }

    /**
     * @param person the event which must be stored
     * @param update
     */
    store(person, update = false)
    {
        if (update) return this.update(person);
        return this.ApiService.post("/persons", person);
    }


    update(person)
    {
        return this.ApiService.put(`/persons/${person.id}`, person);
    }

    /**
     * Deletes the given person
     * @param person
     */
    deletePerson(person)
    {
        return this.ApiService.delete(`/persons/${person.id}`);
    }
}
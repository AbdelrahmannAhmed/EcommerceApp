export class apiFeatures {
    constructor(mongooseQuery, searchQuery) {
        this.mongooseQuery = mongooseQuery;
        this.searchQuery = searchQuery
    }

    pagination() {
        if (this.searchQuery.page < 1) this.searchQuery.page = 1
        let pageNumber = parseInt(this.searchQuery.page) * 1 || 1
        const limit = 3
        this.pageNumber = pageNumber
        let skip = (pageNumber - 1) * limit;
        this.mongooseQuery.skip(skip).limit(limit);
        return this
    }

    filter() {
        let filterObject = structuredClone(this.searchQuery)
        filterObject = JSON.stringify(filterObject)
        filterObject = filterObject.replace(/(gt|gte|lt|lte)/g, value => `$${value}`)
        filterObject = JSON.parse(filterObject)
        let excludedFields = ['page', 'sort', 'fields', 'search']
        excludedFields.forEach((val) => {
            delete filterObject[val]
        })
        this.mongooseQuery.find(filterObject)
        return this
    }

    sort() {
        if (this.searchQuery.sort) {
            let sortedBy = this.searchQuery.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
        }
        return this
    }

    fields() {
        if (this.searchQuery.fields) {
            let selectedFields = this.searchQuery.fields.split(',').join(' ')
            this.mongooseQuery.select(selectedFields)
        }
        return this
    }

    search() {
        if (this.searchQuery.search) {
            this.mongooseQuery.find(
                {
                    $or: [
                        { title: { $regex: this.searchQuery.search, $options: 'i' } },
                        { Desc: { $regex: this.searchQuery.search, $options: 'i' } },
                        { name: { $regex: this.searchQuery.search, $options: 'i' } }
                    ]
                }
            )
        }
        return this
    }
}
import { categories } from "@/data/categories";

export default function CategoryFilter() {

  return(
    <div className="bg-white flex flex-col gap-6 w-1/4 h-55 p-4 flex-wrap rounded-lg">
      {categories.map(cat => {
        const Icon = cat.icon
       return (
        <div key={cat.id} className={`flex items-center gap-2 ${cat.color}`}>
          <input 
            type="checkbox" 
            className="w-5 h-5"  
          />
          <Icon />
          <label htmlFor="" className="text-lg">{cat.name}</label>
        </div>
      )}
      )}
    </div>
  )
}
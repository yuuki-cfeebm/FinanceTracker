import { categories } from "@/data/categories"

export default function Summary() {

  return(
    <div className="flex gap-6 w-full">
      {categories.map(cat => 
        <div key={cat.id} className="flex items-center gap-2">
          <div className={`w-4 h-4 border ${cat.background} ${cat.border}`}></div>
          <span className="text-gray-500">{cat.name}</span>
        </div>
      )}
    </div>
  )
}
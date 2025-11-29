import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

// import {
//   NativeSelect,
//   NativeSelectOption,
// } from "@/components/ui/native-select";

import { SearchIcon } from "lucide-react";
import { UserTable } from "../components/user-table";

export const UserManagementPage = () => {
  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-100 mb-2">
          Quản lí khách hàng
        </h1>
        <p className="text-gray-400 italic font-serif">
          Xem và điều chỉnh thông tin khách hàng
        </p>
      </header>

      {/* Search + Filter */}
      <div className="flex gap-4 items-center">
        <InputGroup className="flex-1 max-w-md shadow-lg shadow-black/40 border border-white/10 bg-[#374151] rounded-lg">
          <InputGroupInput
            placeholder="Tìm kiếm khách hàng..."
            className="bg-transparent text-gray-100 placeholder-gray-400"
          />
          <InputGroupAddon className="text-gray-300">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <NativeSelect className="bg-[#374151] text-gray-100 border border-white/10 rounded-lg shadow-lg shadow-black/40 px-3 py-2">
          <NativeSelectOption value="">Tất cả trạng thái</NativeSelectOption>
          <NativeSelectOption value="active">Hoạt động</NativeSelectOption>
          <NativeSelectOption value="inactive">
            Không hoạt động
          </NativeSelectOption>
        </NativeSelect>
      </div>

      {/* User Table */}
      <UserTable />
    </>
  );
};

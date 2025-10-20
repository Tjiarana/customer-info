<script lang="ts" setup>
const custCode = ref<string>("");
const tradingAccId = ref<string>("");
const subacid = ref<string>("");
const portCode = ref<string>("");
const fundType = ref<number>(0);
const custdianName = ref<string>("");
const aoId = ref<number | null>(null);

const queryParams = ref<any>({
  custCode: "",
  tradingAccId: "",
  subacid: "",
  custdianName: "",

  portCode: "",
  fundType: 0,
  aoId: null,
});

const fundTypeMenu = [{ label: "All", value: 0 }];

const currentTab = ref("customer-info");
const changeCurrentTab = (tab: string) => {
  if (currentTab.value != tab) {
    currentTab.value = tab;
  }
};

const getCustomerInfo = async () => {
  queryParams.value.custCode = custCode.value.trim();
  queryParams.value.tradingAccId = tradingAccId.value.trim();
  queryParams.value.subacid = subacid.value.trim();
  queryParams.value.custdianName = custdianName.value.trim();

  queryParams.value.portCode = portCode.value.trim();
  queryParams.value.fundType = fundType.value;
  queryParams.value.aoId = aoId.value;

  if (queryParams.value.portCode.trim() == "")
    delete queryParams.value.portCode;
  if (queryParams.value.fundType == 0) delete queryParams.value.fundType;
  if (queryParams.value.aoId == null || queryParams.value.aoId == "")
    delete queryParams.value.aoId;

  data.value = await $fetch<{ data: any }>(
    "/backend/api/customer/getCustomer",
    {
      method: "GET",
      query: queryParams.value,
    }
  ).then((r) => r.data);
};

const clearQueryParam = async () => {
  custCode.value = "";
  tradingAccId.value = "";
  subacid.value = "";
  portCode.value = "";
  fundType.value = 0;
  custdianName.value = "";
  aoId.value = null;
  getCustomerInfo();
};

const columns: any[] = [
  { id: "id", accessorKey: "id", header: "Id" },
  { id: "customerCode", accessorKey: "customerCode", header: "Customer" },
  { id: "customerName", accessorKey: "customerName", header: "Customer Name" },
  { id: "contactName", accessorKey: "contactName", header: "Contact Name" },
  { id: "contactTel", accessorKey: "contactTel", header: "Contact Tel" },
];

const data = ref<any>([]);
onBeforeMount(async () => {
  getCustomerInfo();
});

const page = ref(1);
const pageSize = ref(10);

const pageCount = computed(() =>
  Math.max(1, Math.ceil(data.value.length / pageSize.value))
);

const paginatedData = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return data.value.slice(start, start + pageSize.value);
});

watch([data, pageSize], () => {
  page.value = 1;
  if (page.value > pageCount.value) page.value = pageCount.value;
});

const toFirstPage = () => (page.value = 1);
const toPrevPage = () => (page.value = Math.max(1, page.value - 1));
const toNextPage = () =>
  (page.value = Math.min(pageCount.value, page.value + 1));
const toLastPage = () => (page.value = pageCount.value);
</script>

<template>
  <div class="w-full grow p-2 flex flex-col drop-shadow-md rounded-2xl">
    <div class="w-fit ml-2 text-sm flex flex-row">
      <div
        @click="changeCurrentTab('customer-info')"
        class="px-4 py-1.5 border border-gray-300"
        :class="
          currentTab == 'customer-info'
            ? 'bg-white border-b-2 border-b-white -mb-0.5 z-10 cursor-default'
            : 'bg-gray-100 border-b-0 border-r-0 border-gray-300 translate-y-0.5 cursor-pointer'
        "
      >
        <p class="font-semibold">Customer Information</p>
      </div>
      <div
        @click="changeCurrentTab('port-acc-info')"
        class="px-4 py-1.5 border border-gray-300"
        :class="
          currentTab == 'port-acc-info'
            ? 'bg-white border-b-2 border-b-white -mb-0.5 z-10 cursor-default'
            : 'bg-gray-100 border-b-0 border-l-0 border-gray-300 translate-y-0.5 cursor-pointer'
        "
      >
        <p class="font-semibold">Port Account Information</p>
      </div>
    </div>
    <div
      v-if="currentTab == 'customer-info'"
      class="w-full grow bg-white border border-gray-300 px-2 pb-2 pt-2.5 relative"
    >
      <p
        class="absolute -top-0 left-5 bg-white z-20 px-0.5 text-sm font-semibold text-blue-600"
      >
        Query
      </p>
      <div class="w-full border border-gray-200 relative">
        <div class="flex flex-row flex-wrap p-3 gap-1">
          <UFormField label="Customer">
            <UInput
              v-model="custCode"
              color="neutral"
              trailing-icon="i-lucide-search"
            />
          </UFormField>
          <UFormField label="Trading Account">
            <UInput v-model="tradingAccId" color="neutral" />
          </UFormField>
          <UFormField label="Sub Account">
            <UInput v-model="subacid" color="neutral" />
          </UFormField>
          <UFormField label="Port Code">
            <UInput v-model="portCode" color="neutral" />
          </UFormField>
          <UFormField label="Fund Type">
            <USelect
              v-model="fundType"
              value-key="value"
              :items="fundTypeMenu"
              color="neutral"
              class="w-48"
            />
          </UFormField>
          <UFormField label="Custodian">
            <UInput
              v-model="custdianName"
              color="neutral"
              trailing-icon="i-lucide-search"
            />
          </UFormField>
          <UFormField label="A/O">
            <UInput v-model="aoId" color="neutral" />
          </UFormField>
        </div>
        <div class="flex flex-row pb-3 px-3 gap-2 justify-end">
          <u-button
            @click="getCustomerInfo"
            label="Search"
            variant="outline"
            color="neutral"
            class="px-10 py-2 rounded-sm cursor-pointer"
          />
          <u-button
            @click="clearQueryParam"
            label="Clear"
            variant="outline"
            color="neutral"
            class="px-10 py-2 rounded-sm cursor-pointer"
          />
        </div>
      </div>
      <div class="table-viewport">
        <UTable
          :data="paginatedData"
          :columns="columns"
          :column-visibility="{ id: false }"
          class="custom-cust-table"
        />
      </div>
      <div class="mt-2 flex items-center justify-end gap-2">
        <USelect
          v-model="pageSize"
          :items="[5, 10, 20, 50, 100]"
          color="neutral"
          variant="outline"
        />
        <span class="text-xs text-gray-500"
          >Page {{ page }} / {{ pageCount }}</span
        >
        <PaginationButton
          @tofirstpage="toFirstPage"
          action="tofirstpage"
          icon="i-lucide-chevrons-left"
          :disabled="page === 1"
        />
        <PaginationButton
          @toprevpage="toPrevPage"
          action="toprevpage"
          icon="i-lucide-chevron-left"
          :disabled="page === 1"
        />
        <PaginationButton
          @tonextpage="toNextPage"
          action="tonextpage"
          icon="i-lucide-chevron-right"
          :disabled="page === pageCount"
        />
        <PaginationButton
          @tolastpage="toLastPage"
          action="tolastpage"
          icon="i-lucide-chevrons-right"
          :disabled="page === pageCount"
        />
      </div>
      <u-button
        label="Add New Customer"
        variant="outline"
        color="neutral"
        class="px-6 py-4 rounded-sm absolute bottom-2 right-2 cursor-pointer"
      />
    </div>
    <div
      v-else-if="currentTab == 'port-acc-info'"
      class="w-full grow bg-white border border-gray-300 px-2 pb-2 pt-2.5 relative"
    ></div>
  </div>
</template>

<style scoped>
.table-viewport {
  --thead-h: 42px;
  --row-h: 40px;

  height: calc(var(--thead-h) + (var(--row-h) * 10));
  overflow: auto;
}

.custom-cust-table :deep(table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #cfd8e3;
  border-top: 0;
  font-size: 13px;
}

.custom-cust-table :deep(thead tr) {
  background: #4671bb;
}
.custom-cust-table :deep(thead th) {
  color: #fff;
  font-weight: 600;
  padding: 8px 12px;
  border-right: 1px solid #ffffff;
  white-space: nowrap;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;
}
.custom-cust-table :deep(thead th:last-child) {
  border-right: 0;
}

.custom-cust-table :deep(tbody tr) {
  background: #ffffff;
  height: var(--row-h);
}

.custom-cust-table :deep(tbody td) {
  color: #111827;
  padding: 3px 12px;
  border-top: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  vertical-align: middle;
  padding-top: 8px;
  padding-bottom: 8px;
  line-height: calc(var(--row-h) - 16px);
}
.custom-cust-table :deep(tbody td:last-child) {
  border-right: 0;
}
</style>

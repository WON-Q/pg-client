/**
 * CSV 내보내기를 위한 열 정의
 */
export interface CsvColumn {
  /** CSV 헤더에 표시될 열 이름 */
  header: string;
  /** 데이터 객체에서 값을 가져오는 방법 (키 또는 함수) */
  accessor: string | ((item: any) => string);
}

/**
 * 데이터를 CSV 파일로 내보내는 함수
 *
 * @param data - 내보낼 데이터 배열
 * @param columns - CSV 열 정의 배열
 * @param filename - 다운로드될 파일 이름 (확장자 제외)
 */
export function exportToCsv<T>(
  data: T[],
  columns: CsvColumn[],
  filename: string
): void {
  // CSV 헤더 행
  const headers = columns.map((column) => column.header);

  // 데이터 행 생성
  const rows = data.map((item) =>
    columns
      .map((column) => {
        const value =
          typeof column.accessor === "function"
            ? column.accessor(item)
            : item[column.accessor as keyof T];

        // undefined, null 값 처리 및 쉼표 포함된 문자열 처리
        if (value === null || value === undefined) {
          return "-";
        }

        const stringValue = String(value);
        // 쉼표, 줄바꿈, 큰따옴표가 포함된 경우 큰따옴표로 감싸고 내부 큰따옴표는 두 번 사용
        if (
          stringValue.includes(",") ||
          stringValue.includes("\n") ||
          stringValue.includes('"')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      })
      .join(",")
  );

  // CSV 내용 생성
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(",")].concat(rows).join("\n");

  // 다운로드 링크 생성 및 클릭
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

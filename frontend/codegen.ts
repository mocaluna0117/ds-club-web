import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // バックエンドが自動生成する GraphQL スキーマファイルを参照
  schema: '../backend/src/schema.gql',
  // クエリ・ミューテーションが書かれたファイルをスキャン対象に
  documents: 'src/**/*.{ts,tsx}',
  generates: {
    // 生成先ディレクトリ
    './src/__generated__/': {
      preset: 'client',
      config: {
        // DateTime スカラーを string にマップ（JSON 転送時は ISO 8601 文字列になるため）
        scalars: {
          DateTime: 'string',
        },
        // verbatimModuleSyntax 対応: 型のみのインポートに import type を使う
        useTypeImports: true,
      },
    },
  },
};

export default config;
